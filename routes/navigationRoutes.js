import { Router } from 'express';
import {
  getAllNavigation,
  getNavigationById,
  createNavigation,
  updateNavigation,
  deleteNavigation,
  reorderNavigation,
} from '../controllers/navigationController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', getAllNavigation);
router.get('/:id', getNavigationById);
router.post('/', authMiddleware, roleMiddleware('admin'), createNavigation);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateNavigation);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteNavigation);
router.post('/reorder', authMiddleware, roleMiddleware('admin'), reorderNavigation);

export default router;