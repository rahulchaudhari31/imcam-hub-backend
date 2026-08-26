import { validationResult } from 'express-validator';
import Case from '../models/caseModel.js';
import Document from '../models/documentModel.js';
import asyncHandler from '../utils/asyncHandler.js';
import pool from '../config/db.js';
import fs from 'fs';
import path from 'path';

const CASE_STATUSES = ['pending', 'active', 'on_hold', 'completed', 'closed'];
const CASE_PRIORITIES = ['low', 'medium', 'high', 'urgent'];

function verifyCaseAssignment(caseData, userId) {
  return caseData.caseworker_id === userId;
}

export const getAssignedCases = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const rawLimit = parseInt(req.query.limit, 10);
  if (!Number.isNaN(rawLimit) && rawLimit < 0) {
    return res.status(400).json({ message: 'Limit must be greater than 0.' });
  }
  const limit = Math.min(rawLimit || 20, 100);
  const offset = (page - 1) * limit;

  const { status, caseType, priority, search } = req.query;

  if (status && !CASE_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid status filter.' });
  }
  if (caseType) {
    const validCaseTypes = ['skilled_worker', 'sponsor_licence', 'ilr', 'british_citizenship', 'family_visa', 'student_visa', 'visitor_visa', 'other'];
    if (!validCaseTypes.includes(caseType)) {
      return res.status(400).json({ message: 'Invalid case type filter.' });
    }
  }
  if (priority && !CASE_PRIORITIES.includes(priority)) {
    return res.status(400).json({ message: 'Invalid priority filter.' });
  }

  const conditions = ['c.caseworker_id = $1'];
  const params = [req.user.id];
  let paramIdx = 2;

  if (status) {
    conditions.push(`c.status = $${paramIdx++}`);
    params.push(status);
  }
  if (caseType) {
    conditions.push(`c.case_type = $${paramIdx++}`);
    params.push(caseType);
  }
  if (priority) {
    conditions.push(`c.priority = $${paramIdx++}`);
    params.push(priority);
  }
  if (search) {
    conditions.push(`(c.case_number ILIKE $${paramIdx} OR c.title ILIKE $${paramIdx} OR u_client.full_name ILIKE $${paramIdx} OR u_client.email ILIKE $${paramIdx})`);
    params.push(`%${search}%`);
    paramIdx++;
  }

  const where = `WHERE ${conditions.join(' AND ')}`;

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM cases c
     LEFT JOIN users u_client ON c.client_id = u_client.id ${where}`,
    params
  );
  const total = parseInt(countResult.rows[0].count, 10);

  params.push(limit, offset);
  const { rows } = await pool.query(
    `SELECT
       c.id, c.case_number, c.client_id, c.caseworker_id, c.case_type, c.status, c.priority, c.title, c.description, c.created_at, c.updated_at,
       u_client.email AS client_email, u_client.full_name AS client_name
     FROM cases c
     LEFT JOIN users u_client ON c.client_id = u_client.id ${where}
     ORDER BY c.created_at DESC
     LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
    params
  );

  res.json({
    data: rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getAssignedCase = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const caseData = await Case.findById(req.params.id);

  if (!caseData) {
    return res.status(404).json({ message: 'Case not found.' });
  }

  if (!verifyCaseAssignment(caseData, req.user.id)) {
    return res.status(403).json({ message: 'You are not assigned to this case.' });
  }

  res.json({ data: caseData });
});

export const updateAssignedCase = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { status, priority, description } = req.body;
  const { id } = req.params;

  const existingCase = await Case.findById(id);
  if (!existingCase) {
    return res.status(404).json({ message: 'Case not found.' });
  }

  if (!verifyCaseAssignment(existingCase, req.user.id)) {
    return res.status(403).json({ message: 'You are not assigned to this case.' });
  }

  if (status !== undefined) {
    if (!CASE_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }
  }
  if (priority !== undefined) {
    if (!CASE_PRIORITIES.includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority value.' });
    }
  }

  const updatedCase = await Case.update(id, {
    status,
    priority,
    description,
  });

  res.json({ data: updatedCase });
});

export const getCaseDocuments = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { caseId } = req.params;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const rawLimit = parseInt(req.query.limit, 10);
  if (!Number.isNaN(rawLimit) && rawLimit < 0) {
    return res.status(400).json({ message: 'Limit must be greater than 0.' });
  }
  const limit = Math.min(rawLimit || 20, 100);

  const caseData = await Case.findById(caseId);
  if (!caseData) {
    return res.status(404).json({ message: 'Case not found.' });
  }

  if (!verifyCaseAssignment(caseData, req.user.id)) {
    return res.status(403).json({ message: 'You are not assigned to this case.' });
  }

  const result = await Document.findByCaseId(caseId, { page, limit });

  res.json({
    data: result.data,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / limit),
    },
  });
});

export const downloadCaseDocument = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const document = await Document.findById(req.params.id);

  if (!document) {
    return res.status(404).json({ message: 'Document not found.' });
  }

  const caseData = await Case.findById(document.case_id);
  if (!caseData) {
    return res.status(404).json({ message: 'Case not found.' });
  }

  if (!verifyCaseAssignment(caseData, req.user.id)) {
    return res.status(403).json({ message: 'You are not authorized to access this document.' });
  }

  const filePath = path.join(process.cwd(), 'uploads', document.stored_file_name);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found on server.' });
  }

  res.download(filePath, document.original_file_name);
});

export const getDashboard = asyncHandler(async (req, res) => {
  const [totalCases, activeCases, pendingCases, completedCases, recentCases] = await Promise.all([
    pool.query('SELECT COUNT(*) FROM cases WHERE caseworker_id = $1', [req.user.id]),
    pool.query("SELECT COUNT(*) FROM cases WHERE caseworker_id = $1 AND status = 'active'", [req.user.id]),
    pool.query("SELECT COUNT(*) FROM cases WHERE caseworker_id = $1 AND status = 'pending'", [req.user.id]),
    pool.query("SELECT COUNT(*) FROM cases WHERE caseworker_id = $1 AND status IN ('completed', 'closed')", [req.user.id]),
    pool.query(
      `SELECT id, case_number, title, client_id, case_type, status, priority, created_at
       FROM cases WHERE caseworker_id = $1 ORDER BY created_at DESC LIMIT 5`,
      [req.user.id]
    ),
  ]);

  res.json({
    data: {
      stats: {
        totalCases: parseInt(totalCases.rows[0].count, 10),
        activeCases: parseInt(activeCases.rows[0].count, 10),
        pendingCases: parseInt(pendingCases.rows[0].count, 10),
        completedCases: parseInt(completedCases.rows[0].count, 10),
      },
      recentCases: recentCases.rows,
    },
  });
});

export const updateCaseDocument = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { id } = req.params;
  const { status, documentType } = req.body;

  const document = await Document.findById(id);
  if (!document) {
    return res.status(404).json({ message: 'Document not found.' });
  }

  const caseData = await Case.findById(document.case_id);
  if (!caseData) {
    return res.status(404).json({ message: 'Case not found.' });
  }

  if (!verifyCaseAssignment(caseData, req.user.id)) {
    return res.status(403).json({ message: 'You are not authorized to update this document.' });
  }

  if (status) {
    const updated = await Document.updateStatus(id, status);
    return res.json({ data: updated });
  }

  if (documentType) {
    const updated = await Document.updateDocumentType(id, documentType);
    return res.json({ data: updated });
  }

  return res.status(400).json({ message: 'No valid fields to update.' });
});

export const deleteCaseDocument = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { id } = req.params;

  const document = await Document.findById(id);
  if (!document) {
    return res.status(404).json({ message: 'Document not found.' });
  }

  const caseData = await Case.findById(document.case_id);
  if (!caseData) {
    return res.status(404).json({ message: 'Case not found.' });
  }

  if (!verifyCaseAssignment(caseData, req.user.id)) {
    return res.status(403).json({ message: 'You are not authorized to delete this document.' });
  }

  const filePath = path.join(process.cwd(), 'uploads', document.stored_file_name);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await Document.delete(id);

  res.json({ message: 'Document deleted successfully.' });
});