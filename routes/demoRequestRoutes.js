import { Router } from 'express';
import {
  createDemoRequest,
  listDemoRequests,
  getDemoRequest,
  updateDemoRequest,
} from '../controllers/demoRequestController.js';
import {
  createDemoRequestValidation,
  updateDemoRequestValidation,
} from '../validations/demoRequestValidation.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

// Public — submit the Book a Demo form
router.post('/', createDemoRequestValidation, createDemoRequest);

// Protected, admin-only — list all leads
router.get('/', authMiddleware, roleMiddleware('admin'), listDemoRequests);

// Protected, admin-only — get single lead
router.get('/:id', authMiddleware, roleMiddleware('admin'), getDemoRequest);

// Protected, admin-only — update status
router.patch('/:id', authMiddleware, roleMiddleware('admin'), updateDemoRequestValidation, updateDemoRequest);

export default router;
