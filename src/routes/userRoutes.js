import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

router.get('/', adminMiddleware, getAllUsers); // Only admins can list all users
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.delete('/:id', adminMiddleware, deleteUser); // Only admins can delete users

export default router;