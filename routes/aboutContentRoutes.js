import { Router } from 'express';
import { getAboutContent, updateAboutContent } from '../controllers/aboutContentController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', getAboutContent);
router.put('/', authMiddleware, roleMiddleware('admin'), updateAboutContent);

export default router;
