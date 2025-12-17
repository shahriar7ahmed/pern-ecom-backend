import { z } from 'zod';

// Create image schema
export const createImageSchema = z.object({
    productId: z.string().uuid('Invalid product ID'),
    imageUrl: z.string().url('Invalid image URL').max(255, 'Image URL cannot exceed 255 characters'),
    altText: z.string().max(255, 'Alt text cannot exceed 255 characters').optional().nullable(),
    displayOrder: z.number().int().nonnegative('Display order cannot be negative').default(0),
    isPrimary: z.boolean().default(false)
});

// Update image schema
export const updateImageSchema = z.object({
    imageUrl: z.string().url('Invalid image URL').max(255, 'Image URL cannot exceed 255 characters').optional(),
    altText: z.string().max(255, 'Alt text cannot exceed 255 characters').optional().nullable(),
    displayOrder: z.number().int().nonnegative('Display order cannot be negative').optional(),
    isPrimary: z.boolean().optional()
});

// Image ID validation
export const imageIdSchema = z.object({
    id: z.string().uuid('Invalid image ID')
});
