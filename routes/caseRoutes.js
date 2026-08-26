import { Router } from 'express';
import {
  createCase,
  listCases,
  getCase,
  updateCase,
  deleteCase,
  getCaseClients,
  getCaseCaseworkers,
} from '../controllers/caseController.js';
import {
  createCaseValidation,
  updateCaseValidation,
  getCaseValidation,
} from '../validations/caseValidation.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

// All routes require admin authentication
router.use(authMiddleware, roleMiddleware('admin'));

// GET /api/cases/clients - Get all clients for dropdown
router.get('/clients', getCaseClients);

// GET /api/cases/caseworkers - Get all caseworkers for dropdown
router.get('/caseworkers', getCaseCaseworkers);

// POST /api/cases - Create new case
router.post('/', createCaseValidation, createCase);

// GET /api/cases - List cases with pagination, search, filter
router.get('/', listCases);

// GET /api/cases/:id - Get single case
router.get('/:id', getCaseValidation, getCase);

// PATCH /api/cases/:id - Update case
router.patch('/:id', updateCaseValidation, updateCase);

// DELETE /api/cases/:id - Delete case
router.delete('/:id', getCaseValidation, deleteCase);

export default router;