import { prisma } from '../database/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import {
    createVariantSchema,
    updateVariantSchema,
    variantIdSchema
} from '../validators/variantValidator.js';

/**
 * Get all product variants
 * @route GET /api/variants
 */
export const getAllVariants = asyncHandler(async (req, res) => {
    const variants = await prisma.productVariant.findMany({
        include: {
            product: {
                select: {
                    id: true,
                    title: true,
                    slug: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    ApiResponse.success(res, { variants }, 'Variants fetched successfully');
});

/**
 * Get variant by ID
 * @route GET /api/variants/:id
 */
export const getVariantById = asyncHandler(async (req, res) => {
    const { success, data } = variantIdSchema.safeParse({ id: req.params.id });

    if (!success) {
        return ApiResponse.error(res, 'Invalid variant ID format', HTTP_STATUS.BAD_REQUEST);
    }

    const variant = await prisma.productVariant.findUnique({
        where: { id: data.id },
        include: {
            product: true
        }
    });

    if (!variant) {
        return ApiResponse.notFound(res, 'Variant not found');
    }

    ApiResponse.success(res, { variant }, 'Variant fetched successfully');
});

/**
 * Create new product variant
 * @route POST /api/variants
 */
export const createVariant = asyncHandler(async (req, res) => {
    const { success, data, error } = createVariantSchema.safeParse(req.body);

    if (!success) {
        return ApiResponse.validationError(res, error.errors);
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
        where: { id: data.productId }
    });

    if (!product) {
        return ApiResponse.notFound(res, 'Product not found');
    }

    const variant = await prisma.productVariant.create({
        data,
        include: {
            product: true
        }
    });

    ApiResponse.success(res, { variant }, 'Variant created successfully', HTTP_STATUS.CREATED);
});

/**
 * Update product variant
 * @route PUT /api/variants/:id
 */
export const updateVariant = asyncHandler(async (req, res) => {
    const { success: idSuccess, data: idData } = variantIdSchema.safeParse({ id: req.params.id });

    if (!idSuccess) {
        return ApiResponse.error(res, 'Invalid variant ID format', HTTP_STATUS.BAD_REQUEST);
    }

    const { success: bodySuccess, data: bodyData, error } = updateVariantSchema.safeParse(req.body);

    if (!bodySuccess) {
        return ApiResponse.validationError(res, error.errors);
    }

    // Check if variant exists
    const existingVariant = await prisma.productVariant.findUnique({
        where: { id: idData.id }
    });

    if (!existingVariant) {
        return ApiResponse.notFound(res, 'Variant not found');
    }

    const variant = await prisma.productVariant.update({
        where: { id: idData.id },
        data: bodyData,
        include: {
            product: true
        }
    });

    ApiResponse.success(res, { variant }, 'Variant updated successfully');
});

/**
 * Delete product variant
 * @route DELETE /api/variants/:id
 */
export const deleteVariant = asyncHandler(async (req, res) => {
    const { success, data } = variantIdSchema.safeParse({ id: req.params.id });

    if (!success) {
        return ApiResponse.error(res, 'Invalid variant ID format', HTTP_STATUS.BAD_REQUEST);
    }

    // Check if variant exists
    const existingVariant = await prisma.productVariant.findUnique({
        where: { id: data.id }
    });

    if (!existingVariant) {
        return ApiResponse.notFound(res, 'Variant not found');
    }

    await prisma.productVariant.delete({
        where: { id: data.id }
    });

    ApiResponse.success(res, {}, 'Variant deleted successfully');
});
