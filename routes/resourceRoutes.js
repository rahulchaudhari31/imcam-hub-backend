import { Router } from 'express';
import {
  getAllResourceCategories,
  getResourceCategoryById,
  createResourceCategory,
  updateResourceCategory,
  deleteResourceCategory,
  reorderResourceCategories,
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  reorderResources,
} from '../controllers/resourceController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/categories', getAllResourceCategories);
router.get('/categories/:id', getResourceCategoryById);
router.post('/categories', authMiddleware, roleMiddleware('admin'), createResourceCategory);
router.put('/categories/:id', authMiddleware, roleMiddleware('admin'), updateResourceCategory);
router.delete('/categories/:id', authMiddleware, roleMiddleware('admin'), deleteResourceCategory);
router.post('/categories/reorder', authMiddleware, roleMiddleware('admin'), reorderResourceCategories);
router.get('/', getAllResources);
router.get('/:id', getResourceById);
router.post('/', authMiddleware, roleMiddleware('admin'), createResource);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateResource);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteResource);
router.post('/reorder', authMiddleware, roleMiddleware('admin'), reorderResources);

export default router;