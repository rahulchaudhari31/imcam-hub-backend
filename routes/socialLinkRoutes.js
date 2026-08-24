import { Router } from 'express';
import { getAllSocialLinks, getSocialLink, createSocialLink, updateSocialLink, deleteSocialLink } from '../controllers/socialLinkController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', getAllSocialLinks);
router.get('/:id', getSocialLink);
router.post('/', authMiddleware, roleMiddleware('admin'), createSocialLink);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateSocialLink);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteSocialLink);

export default router;
