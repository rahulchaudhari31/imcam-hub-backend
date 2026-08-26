import { Router } from 'express';
import {
  uploadDocument,
  listDocuments,
  getDocument,
  downloadDocument,
  updateDocument,
  deleteDocument,
} from '../controllers/documentController.js';
import {
  uploadDocumentValidation,
  listDocumentsValidation,
  getDocumentValidation,
  updateDocumentValidation,
  deleteDocumentValidation,
} from '../validations/documentValidation.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import upload from '../config/upload.js';

const router = Router();

const adminAuth = [authMiddleware, roleMiddleware('admin')];

router.post(
  '/cases/:caseId/documents',
  ...adminAuth,
  upload.single('file'),
  uploadDocumentValidation,
  uploadDocument
);

router.get(
  '/cases/:caseId/documents',
  ...adminAuth,
  listDocumentsValidation,
  listDocuments
);

router.get(
  '/documents/:id',
  ...adminAuth,
  getDocumentValidation,
  getDocument
);

router.get(
  '/documents/:id/download',
  ...adminAuth,
  getDocumentValidation,
  downloadDocument
);

router.patch(
  '/documents/:id',
  ...adminAuth,
  updateDocumentValidation,
  updateDocument
);

router.delete(
  '/documents/:id',
  ...adminAuth,
  deleteDocumentValidation,
  deleteDocument
);

export default router;