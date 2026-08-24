import { Router } from 'express';
import { getAllUsers, getUser, updateUser, deleteUser } from '../controllers/adminUserController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authMiddleware, roleMiddleware('admin'));

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
