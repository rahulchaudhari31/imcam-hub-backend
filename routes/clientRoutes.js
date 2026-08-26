import { Router } from 'express';
import {
  getDashboard,
  getMyCases,
  getMyCase,
  getMyCaseDocuments,
  downloadMyDocument,
} from '../controllers/clientController.js';
import {
  getCaseValidation,
} from '../validations/caseValidation.js';
import {
  listDocumentsValidation,
  getDocumentValidation,
} from '../validations/documentValidation.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authMiddleware, roleMiddleware('client'));

router.get('/dashboard', getDashboard);
router.get('/cases', getMyCases);
router.get('/cases/:id', getCaseValidation, getMyCase);
router.get('/cases/:caseId/documents', listDocumentsValidation, getMyCaseDocuments);
router.get('/documents/:id/download', getDocumentValidation, downloadMyDocument);

export default router;