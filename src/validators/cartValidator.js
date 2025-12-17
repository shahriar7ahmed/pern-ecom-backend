import { z } from 'zod';

// Add to cart schema
export const addToCartSchema = z.object({
    cartId: z.string().uuid('Invalid cart ID').optional(),
    userId: z.string().uuid('Invalid user ID').optional(),
    sessionId: z.string().optional(),
    productId: z.string().uuid('Invalid product ID'),
    variantId: z.string().uuid('Invalid variant ID').optional().nullable(),
    quantity: z.number().int().positive('Quantity must be positive').default(1)
});

// Update cart item schema
export const updateCartItemSchema = z.object({
    quantity: z.number().int().positive('Quantity must be positive')
});

// Cart item ID validation
export const cartItemIdSchema = z.object({
    id: z.string().uuid('Invalid cart item ID')
});

// Cart ID validation
export const cartIdSchema = z.object({
    id: z.string().uuid('Invalid cart ID')
});
