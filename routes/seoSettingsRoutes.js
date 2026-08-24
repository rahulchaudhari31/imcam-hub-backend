import { Router } from 'express';
import { getAllSeo, getSeoByPage, upsertSeo } from '../controllers/seoSettingsController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', getAllSeo);
router.get('/:pageKey', getSeoByPage);
router.put('/', authMiddleware, roleMiddleware('admin'), upsertSeo);

export default router;
