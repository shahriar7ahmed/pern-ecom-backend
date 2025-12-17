import { z } from 'zod';

// Category creation schema
export const createCategorySchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name cannot exceed 100 characters'),
    slug: z.string().min(3, 'Slug must be at least 3 characters'),
    description: z.string().min(5, 'Description must be at least 5 characters'),
    imageUrl: z.string().url('Invalid image URL'),
    parentId: z.string().uuid('Invalid parent category ID').optional().nullable()
});

// Category update schema
export const updateCategorySchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name cannot exceed 100 characters').optional(),
    slug: z.string().min(3, 'Slug must be at least 3 characters').optional(),
    description: z.string().min(5, 'Description must be at least 5 characters').optional(),
    imageUrl: z.string().url('Invalid image URL').optional(),
    parentId: z.string().uuid('Invalid parent category ID').optional().nullable()
});

// Category ID validation
export const categoryIdSchema = z.object({
    id: z.string().uuid('Invalid category ID format')
});
