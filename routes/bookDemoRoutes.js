import { Router } from 'express';
import {
  getBookDemoConfig,
  createOrUpdateBookDemoConfig,
} from '../controllers/bookDemoController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', getBookDemoConfig);
router.put('/', authMiddleware, roleMiddleware('admin'), createOrUpdateBookDemoConfig);

export default router;