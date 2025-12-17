import { prisma } from '../database/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';
import {
    addToCartSchema,
    updateCartItemSchema,
    cartItemIdSchema,
    cartIdSchema
} from '../validators/cartValidator.js';

/**
 * Get or create cart for user/session
 * @route GET /api/cart
 */
export const getCart = asyncHandler(async (req, res) => {
    const { userId, sessionId } = req.query;

    if (!userId && !sessionId) {
        return ApiResponse.error(res, 'Either userId or sessionId is required', HTTP_STATUS.BAD_REQUEST);
    }

    let cart = await prisma.cart.findFirst({
        where: userId ? { userId } : { sessionId },
        include: {
            cartItems: {
                include: {
                    product: {
                        include: {
                            images: {
                                where: { isPrimary: true },
                                take: 1
                            }
                        }
                    },
                    variant: true
                }
            }
        }
    });

    if (!cart) {
        cart = await prisma.cart.create({
            data: {
                userId: userId || null,
                sessionId: sessionId || null
            },
            include: {
                cartItems: true
            }
        });
    }

    ApiResponse.success(res, { cart }, MESSAGES.CART_FETCHED);
});

/**
 * Add item to cart
 * @route POST /api/cart/items
 */
export const addToCart = asyncHandler(async (req, res) => {
    const { success, data, error } = addToCartSchema.safeParse(req.body);

    if (!success) {
        return ApiResponse.validationError(res, error.errors);
    }

    // Get or create cart
    let cart;
    if (data.cartId) {
        cart = await prisma.cart.findUnique({
            where: { id: data.cartId }
        });
    } else if (data.userId || data.sessionId) {
        cart = await prisma.cart.findFirst({
            where: data.userId ? { userId: data.userId } : { sessionId: data.sessionId }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    userId: data.userId || null,
                    sessionId: data.sessionId || null
                }
            });
        }
    }

    if (!cart) {
        return ApiResponse.error(res, 'Cart not found or could not be created', HTTP_STATUS.BAD_REQUEST);
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
        where: {
            cartId: cart.id,
            productId: data.productId,
            variantId: data.variantId || null
        }
    });

    let cartItem;
    if (existingItem) {
        // Update quantity
        cartItem = await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: {
                quantity: existingItem.quantity + data.quantity
            },
            include: {
                product: true,
                variant: true
            }
        });
    } else {
        // Create new cart item
        cartItem = await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId: data.productId,
                variantId: data.variantId,
                quantity: data.quantity
            },
            include: {
                product: true,
                variant: true
            }
        });
    }

    ApiResponse.success(res, { cartItem }, MESSAGES.CART_ITEM_ADDED, HTTP_STATUS.CREATED);
});

/**
 * Update cart item quantity
 * @route PUT /api/cart/items/:id
 */
export const updateCartItem = asyncHandler(async (req, res) => {
    const { success: idSuccess, data: idData } = cartItemIdSchema.safeParse({ id: req.params.id });

    if (!idSuccess) {
        return ApiResponse.error(res, 'Invalid cart item ID', HTTP_STATUS.BAD_REQUEST);
    }

    const { success: bodySuccess, data: bodyData, error } = updateCartItemSchema.safeParse(req.body);

    if (!bodySuccess) {
        return ApiResponse.validationError(res, error.errors);
    }

    const cartItem = await prisma.cartItem.update({
        where: { id: idData.id },
        data: { quantity: bodyData.quantity },
        include: {
            product: true,
            variant: true
        }
    });

    ApiResponse.success(res, { cartItem }, MESSAGES.CART_ITEM_UPDATED);
});

/**
 * Remove item from cart
 * @route DELETE /api/cart/items/:id
 */
export const removeFromCart = asyncHandler(async (req, res) => {
    const { success, data } = cartItemIdSchema.safeParse({ id: req.params.id });

    if (!success) {
        return ApiResponse.error(res, 'Invalid cart item ID', HTTP_STATUS.BAD_REQUEST);
    }

    await prisma.cartItem.delete({
        where: { id: data.id }
    });

    ApiResponse.success(res, {}, MESSAGES.CART_ITEM_REMOVED);
});

/**
 * Clear cart
 * @route DELETE /api/cart/:id/clear
 */
export const clearCart = asyncHandler(async (req, res) => {
    const { success, data } = cartIdSchema.safeParse({ id: req.params.id });

    if (!success) {
        return ApiResponse.error(res, 'Invalid cart ID', HTTP_STATUS.BAD_REQUEST);
    }

    await prisma.cartItem.deleteMany({
        where: { cartId: data.id }
    });

    ApiResponse.success(res, {}, MESSAGES.CART_CLEARED);
});
