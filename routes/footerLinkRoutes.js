import { Router } from 'express';
import {
  getAllFooterLinks,
  getFooterLinksGrouped,
  getFooterLinkById,
  createFooterLink,
  updateFooterLink,
  deleteFooterLink,
  reorderFooterLinks,
} from '../controllers/footerLinkController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', getAllFooterLinks);
router.get('/grouped', getFooterLinksGrouped);
router.get('/:id', getFooterLinkById);
router.post('/', authMiddleware, roleMiddleware('admin'), createFooterLink);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateFooterLink);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteFooterLink);
router.post('/reorder', authMiddleware, roleMiddleware('admin'), reorderFooterLinks);

export default router;