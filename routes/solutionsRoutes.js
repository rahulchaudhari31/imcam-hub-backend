import { Router } from 'express';
import {
  getAllSolutions,
  getSolutionsBySectionKey,
  getSolutionsById,
  createSolutions,
  updateSolutions,
  deleteSolutions,
} from '../controllers/solutionsController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', getAllSolutions);
router.get('/section/:sectionKey', getSolutionsBySectionKey);
router.get('/:id', getSolutionsById);
router.post('/', authMiddleware, roleMiddleware('admin'), createSolutions);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateSolutions);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteSolutions);

export default router;