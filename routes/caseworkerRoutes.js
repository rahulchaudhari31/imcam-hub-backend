import { Router } from 'express';
import {
  getAssignedCases,
  getAssignedCase,
  updateAssignedCase,
  getCaseDocuments,
  downloadCaseDocument,
  getDashboard,
  updateCaseDocument,
  deleteCaseDocument,
} from '../controllers/caseworkerController.js';
import {
  getCaseValidation,
  updateCaseValidation,
} from '../validations/caseValidation.js';
import {
  listDocumentsValidation,
  getDocumentValidation,
  updateDocumentValidation,
  deleteDocumentValidation,
} from '../validations/documentValidation.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authMiddleware, roleMiddleware('caseworker'));

router.get('/dashboard', getDashboard);
router.get('/cases', getAssignedCases);
router.get('/cases/:id', getCaseValidation, getAssignedCase);
router.patch('/cases/:id', updateCaseValidation, updateAssignedCase);

router.get('/cases/:caseId/documents', listDocumentsValidation, getCaseDocuments);
router.get('/documents/:id/download', getDocumentValidation, downloadCaseDocument);
router.patch('/documents/:id', updateDocumentValidation, updateCaseDocument);
router.delete('/documents/:id', deleteDocumentValidation, deleteCaseDocument);

export default router;