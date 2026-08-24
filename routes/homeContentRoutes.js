import { Router } from 'express';
import { getAllSections, getSection, getSectionById, createSection, updateSection, deleteSection } from '../controllers/homeContentController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', getAllSections);
router.get('/section/:sectionKey', getSection);
router.get('/:id', getSectionById);
router.post('/', authMiddleware, roleMiddleware('admin'), createSection);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateSection);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteSection);

export default router;
