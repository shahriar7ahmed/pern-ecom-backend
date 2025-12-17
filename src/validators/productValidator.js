import { z } from 'zod';

// Product creation schema
export const createProductSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    slug: z.string().min(3, 'Slug must be at least 3 characters'),
    description: z.string().min(5, 'Description must be at least 5 characters'),
    basePrice: z.number().positive('Base price must be positive'),
    originalPrice: z.number().positive('Original price must be positive').optional(),
    stockQuantity: z.number().int().nonnegative('Stock quantity cannot be negative'),
    specifications: z.record(z.any()).optional().default({}),
    isFeatured: z.boolean().optional().default(false),
    isActive: z.boolean().optional().default(true),
    categoryId: z.string().uuid('Invalid category ID format')
});

// Product update schema (all fields optional)
export const updateProductSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').optional(),
    slug: z.string().min(3, 'Slug must be at least 3 characters').optional(),
    description: z.string().min(5, 'Description must be at least 5 characters').optional(),
    basePrice: z.number().positive('Base price must be positive').optional(),
    originalPrice: z.number().positive('Original price must be positive').optional(),
    stockQuantity: z.number().int().nonnegative('Stock quantity cannot be negative').optional(),
    specifications: z.record(z.any()).optional(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
    categoryId: z.string().uuid('Invalid category ID format').optional()
});

// Product ID validation
export const productIdSchema = z.object({
    id: z.string().uuid('Invalid product ID format')
});
