import { Router } from 'express';
import { getAllServices, getService, createService, updateService, deleteService } from '../controllers/serviceController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', getAllServices);
router.get('/:id', getService);
router.post('/', authMiddleware, roleMiddleware('admin'), createService);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateService);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteService);

export default router;
