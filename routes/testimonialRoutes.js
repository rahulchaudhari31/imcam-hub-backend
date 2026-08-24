import { Router } from 'express';
import { getAllTestimonials, getTestimonial, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonialController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', getAllTestimonials);
router.get('/:id', getTestimonial);
router.post('/', authMiddleware, roleMiddleware('admin'), createTestimonial);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateTestimonial);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteTestimonial);

export default router;
