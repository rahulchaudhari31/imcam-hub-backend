import { Router } from 'express';
import { getDashboard } from '../controllers/dashboardController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', authMiddleware, roleMiddleware('admin'), getDashboard);

export default router;
