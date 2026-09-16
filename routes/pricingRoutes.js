import { Router } from 'express';
import {
  getAllPricingPlans,
  getPricingPlanById,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
  reorderPricingPlanFeatures,
  getPricingComparison,
  createPricingComparison,
  updatePricingComparison,
  deletePricingComparison,
  reorderPricingComparison,
} from '../controllers/pricingController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', getAllPricingPlans);
router.get('/:id', getPricingPlanById);
router.post('/', authMiddleware, roleMiddleware('admin'), createPricingPlan);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updatePricingPlan);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deletePricingPlan);
router.post('/features/reorder', authMiddleware, roleMiddleware('admin'), reorderPricingPlanFeatures);
router.get('/comparison', getPricingComparison);
router.post('/comparison', authMiddleware, roleMiddleware('admin'), createPricingComparison);
router.put('/comparison/:id', authMiddleware, roleMiddleware('admin'), updatePricingComparison);
router.delete('/comparison/:id', authMiddleware, roleMiddleware('admin'), deletePricingComparison);
router.post('/comparison/reorder', authMiddleware, roleMiddleware('admin'), reorderPricingComparison);

export default router;