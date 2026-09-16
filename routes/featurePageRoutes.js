import { Router } from 'express';
import {
  getAllFeaturePages,
  getFeaturePageByKey,
  getFeaturePageById,
  createFeaturePage,
  updateFeaturePage,
  deleteFeaturePage,
  reorderFeaturePageFeatures,
  getFeaturePageFeatures,
  createFeaturePageFeature,
  updateFeaturePageFeature,
  deleteFeaturePageFeature,
} from '../controllers/featurePageController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', getAllFeaturePages);
router.get('/page/:pageKey', getFeaturePageByKey);
router.get('/:id', getFeaturePageById);
router.post('/', authMiddleware, roleMiddleware('admin'), createFeaturePage);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateFeaturePage);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteFeaturePage);
router.post('/features/reorder', authMiddleware, roleMiddleware('admin'), reorderFeaturePageFeatures);
router.get('/:pageId/features', getFeaturePageFeatures);
router.post('/features', authMiddleware, roleMiddleware('admin'), createFeaturePageFeature);
router.put('/features/:id', authMiddleware, roleMiddleware('admin'), updateFeaturePageFeature);
router.delete('/features/:id', authMiddleware, roleMiddleware('admin'), deleteFeaturePageFeature);

export default router;