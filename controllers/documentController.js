import { validationResult } from 'express-validator';
import Document from '../models/documentModel.js';
import Case from '../models/caseModel.js';
import asyncHandler from '../utils/asyncHandler.js';
import fs from 'fs';
import path from 'path';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
];

const DANGEROUS_EXTENSIONS = ['.exe', '.bat', '.cmd', '.ps1', '.js', '.vbs', '.scr', '.msi', '.jar', '.php', '.asp', '.aspx', '.jsp', '.sh'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function isFileExtensionDangerous(filename) {
  const ext = path.extname(filename).toLowerCase();
  return DANGEROUS_EXTENSIONS.includes(ext);
}

function isMimeTypeAllowed(mimeType) {
  return ALLOWED_MIME_TYPES.includes(mimeType);
}

export const uploadDocument = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const { caseId } = req.params;
  const { documentType } = req.body;
  const uploadedBy = req.user.id;

  const caseExists = await Document.verifyCaseExists(caseId);
  if (!caseExists) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(404).json({ message: 'Case not found.' });
  }

  if (!isMimeTypeAllowed(req.file.mimetype)) {
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ message: 'File type not allowed. Allowed types: PDF, images (JPEG, PNG, GIF, WebP), Word, Excel, and plain text.' });
  }

  if (isFileExtensionDangerous(req.file.originalname)) {
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ message: 'File type not allowed for security reasons.' });
  }

  if (req.file.size > MAX_FILE_SIZE) {
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(413).json({ message: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)} MB.` });
  }

  const document = await Document.create({
    caseId,
    uploadedBy,
    documentType,
    originalFileName: req.file.originalname,
    storedFileName: req.file.filename,
    mimeType: req.file.mimetype,
    fileSize: req.file.size,
  });

  res.status(201).json({ data: document });
});

export const listDocuments = asyncHandler(async (req, res) => {
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

  const caseExists = await Document.verifyCaseExists(caseId);
  if (!caseExists) {
    return res.status(404).json({ message: 'Case not found.' });
  }

  const result = await Document.findByCaseId(caseId, { page, limit });

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

export const getDocument = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const document = await Document.findById(req.params.id);

  if (!document) {
    return res.status(404).json({ message: 'Document not found.' });
  }

  res.json({ data: document });
});

export const downloadDocument = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const document = await Document.findById(req.params.id);

  if (!document) {
    return res.status(404).json({ message: 'Document not found.' });
  }

  const filePath = path.join(process.cwd(), 'uploads', document.stored_file_name);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found on server.' });
  }

  res.download(filePath, document.original_file_name);
});

export const updateDocument = asyncHandler(async (req, res) => {
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

export const deleteDocument = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { id } = req.params;

  const document = await Document.findById(id);
  if (!document) {
    return res.status(404).json({ message: 'Document not found.' });
  }

  const filePath = path.join(process.cwd(), 'uploads', document.stored_file_name);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await Document.delete(id);

  res.json({ message: 'Document deleted successfully.' });
});