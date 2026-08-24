import { Router } from 'express';
import { getAllMedia, uploadMedia, updateMediaAltText, deleteMedia } from '../controllers/mediaController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import upload from '../config/upload.js';

const router = Router();

router.get('/', authMiddleware, roleMiddleware('admin'), getAllMedia);
router.post('/', authMiddleware, roleMiddleware('admin'), upload.single('file'), uploadMedia);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateMediaAltText);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteMedia);

export default router;
