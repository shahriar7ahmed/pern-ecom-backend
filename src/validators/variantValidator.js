import { z } from 'zod';

// Create variant schema
export const createVariantSchema = z.object({
    productId: z.string().uuid('Invalid product ID'),
    variantName: z.string().max(50, 'Variant name cannot exceed 50 characters'),
    variantValue: z.string().max(50, 'Variant value cannot exceed 50 characters'),
    priceAdjustment: z.number().default(0.00),
    stockQuantity: z.number().int().nonnegative('Stock quantity cannot be negative').default(0),
    imageUrl: z.string().url('Invalid image URL').max(255, 'Image URL cannot exceed 255 characters').optional().nullable()
});

// Update variant schema
export const updateVariantSchema = z.object({
    variantName: z.string().max(50, 'Variant name cannot exceed 50 characters').optional(),
    variantValue: z.string().max(50, 'Variant value cannot exceed 50 characters').optional(),
    priceAdjustment: z.number().optional(),
    stockQuantity: z.number().int().nonnegative('Stock quantity cannot be negative').optional(),
    imageUrl: z.string().url('Invalid image URL').max(255, 'Image URL cannot exceed 255 characters').optional().nullable()
});

// Variant ID validation
export const variantIdSchema = z.object({
    id: z.string().uuid('Invalid variant ID')
});
