import { Router } from 'express';
import { userSignUp, userSignIn, getCurrentUser } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimitMiddleware.js';

const router = Router();

// Apply rate limiting to all auth routes
router.use(authLimiter);

router.post('/sign-up', userSignUp);
router.post('/sign-in', userSignIn);
router.get('/me', authMiddleware, getCurrentUser);

export default router;