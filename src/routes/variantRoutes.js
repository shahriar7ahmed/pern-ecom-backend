import { Router } from 'express';
import {
    getAllVariants,
    getVariantById,
    createVariant,
    updateVariant,
    deleteVariant
} from '../controllers/variantController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = Router();

// Public routes
router.get('/', getAllVariants);
router.get('/:id', getVariantById);

// Admin routes (requires authentication + admin role)
router.post('/', authMiddleware, adminMiddleware, createVariant);
router.put('/:id', authMiddleware, adminMiddleware, updateVariant);
router.delete('/:id', authMiddleware, adminMiddleware, deleteVariant);

export default router;
