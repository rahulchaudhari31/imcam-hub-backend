import { validationResult } from 'express-validator';
import Case from '../models/caseModel.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createCase = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { clientId, caseworkerId, caseType, priority, title, description, status } = req.body;

  const client = await Case.verifyClient(clientId);
  if (!client) {
    return res.status(404).json({ message: 'Client not found.' });
  }
  if (client.role !== 'client') {
    return res.status(400).json({ message: 'Selected user is not a client.' });
  }

  if (caseworkerId) {
    const caseworker = await Case.verifyCaseworker(caseworkerId);
    if (!caseworker) {
      return res.status(404).json({ message: 'Caseworker not found.' });
    }
    if (caseworker.role !== 'caseworker') {
      return res.status(400).json({ message: 'Selected user is not a caseworker.' });
    }
  }

  const newCase = await Case.create({
    clientId,
    caseworkerId,
    caseType,
    priority,
    title,
    description,
    status,
  });

  res.status(201).json({ data: newCase });
});

export const listCases = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const rawLimit = parseInt(req.query.limit, 10);
  if (!Number.isNaN(rawLimit) && rawLimit < 0) {
    return res.status(400).json({ message: 'Limit must be greater than 0.' });
  }
  const limit = Math.min(rawLimit || 20, 100);

  const { status, caseType, priority, search } = req.query;

  const validStatuses = ['pending', 'active', 'on_hold', 'completed', 'closed'];
  const validCaseTypes = ['skilled_worker', 'sponsor_licence', 'ilr', 'british_citizenship', 'family_visa', 'student_visa', 'visitor_visa', 'other'];
  const validPriorities = ['low', 'medium', 'high', 'urgent'];

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status filter.' });
  }
  if (caseType && !validCaseTypes.includes(caseType)) {
    return res.status(400).json({ message: 'Invalid case type filter.' });
  }
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({ message: 'Invalid priority filter.' });
  }

  const result = await Case.findAll({ page, limit, status, caseType, priority, search });

  res.json({
    data: result.data,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit),
    },
  });
});

export const getCase = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const caseData = await Case.findById(req.params.id);

  if (!caseData) {
    return res.status(404).json({ message: 'Case not found.' });
  }

  res.json({ data: caseData });
});

export const updateCase = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { caseworkerId, status, priority, caseType, title, description } = req.body;
  const { id } = req.params;

  const existingCase = await Case.findById(id);
  if (!existingCase) {
    return res.status(404).json({ message: 'Case not found.' });
  }

  if (caseworkerId !== undefined) {
    if (caseworkerId) {
      const caseworker = await Case.verifyCaseworker(caseworkerId);
      if (!caseworker) {
        return res.status(404).json({ message: 'Caseworker not found.' });
      }
      if (caseworker.role !== 'caseworker') {
        return res.status(400).json({ message: 'Selected user is not a caseworker.' });
      }
    }
  }

  const updatedCase = await Case.update(id, {
    caseworkerId: caseworkerId === '' ? null : caseworkerId,
    status,
    priority,
    caseType,
    title,
    description,
  });

  res.json({ data: updatedCase });
});

export const deleteCase = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { id } = req.params;

  const existingCase = await Case.findById(id);
  if (!existingCase) {
    return res.status(404).json({ message: 'Case not found.' });
  }

  await Case.delete(id);
  res.json({ message: 'Case deleted successfully.' });
});

export const getCaseClients = asyncHandler(async (req, res) => {
  const clients = await Case.getClients();
  res.json({ data: clients });
});

export const getCaseCaseworkers = asyncHandler(async (req, res) => {
  const caseworkers = await Case.getCaseworkers();
  res.json({ data: caseworkers });
});