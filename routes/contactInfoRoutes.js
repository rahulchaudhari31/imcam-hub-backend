import { Router } from 'express';
import { getContactInfo, updateContactInfo } from '../controllers/contactInfoController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', getContactInfo);
router.put('/', authMiddleware, roleMiddleware('admin'), updateContactInfo);

export default router;
