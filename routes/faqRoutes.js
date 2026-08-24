import { Router } from 'express';
import { getAllFaqs, getFaq, createFaq, updateFaq, deleteFaq } from '../controllers/faqController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', getAllFaqs);
router.get('/:id', getFaq);
router.post('/', authMiddleware, roleMiddleware('admin'), createFaq);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateFaq);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteFaq);

export default router;
