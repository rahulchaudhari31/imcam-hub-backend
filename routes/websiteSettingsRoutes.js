import { Router } from 'express';
import { getAllSettings, getSetting, updateSetting, bulkUpdateSettings } from '../controllers/websiteSettingsController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', getAllSettings);
router.get('/:key', getSetting);
router.put('/:key', authMiddleware, roleMiddleware('admin'), updateSetting);
router.put('/', authMiddleware, roleMiddleware('admin'), bulkUpdateSettings);

export default router;
