import { Router } from 'express';
import {
    getAllImages,
    getImageById,
    createImage,
    updateImage,
    deleteImage
} from '../controllers/imageController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = Router();

// Public routes
router.get('/', getAllImages);
router.get('/:id', getImageById);

// Admin routes (requires authentication + admin role)
router.post('/', authMiddleware, adminMiddleware, createImage);
router.put('/:id', authMiddleware, adminMiddleware, updateImage);
router.delete('/:id', authMiddleware, adminMiddleware, deleteImage);

export default router;
