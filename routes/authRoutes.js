import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { registerValidation, loginValidation } from '../validations/authValidation.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authMiddleware, getMe);

export default router;
