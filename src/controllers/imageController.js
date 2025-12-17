import { prisma } from '../database/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import { MESSAGES } from '../constants/messages.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import {
    createImageSchema,
    updateImageSchema,
    imageIdSchema
} from '../validators/imageValidator.js';

/**
 * Get all product images
 * @route GET /api/images
 */
export const getAllImages = asyncHandler(async (req, res) => {
    const images = await prisma.productImage.findMany({
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

    ApiResponse.success(res, { images }, 'Images fetched successfully');
});

/**
 * Get image by ID
 * @route GET /api/images/:id
 */
export const getImageById = asyncHandler(async (req, res) => {
    const { success, data } = imageIdSchema.safeParse({ id: req.params.id });

    if (!success) {
        return ApiResponse.error(res, 'Invalid image ID format', HTTP_STATUS.BAD_REQUEST);
    }

    const image = await prisma.productImage.findUnique({
        where: { id: data.id },
        include: {
            product: true
        }
    });

    if (!image) {
        return ApiResponse.notFound(res, 'Image not found');
    }

    ApiResponse.success(res, { image }, 'Image fetched successfully');
});

/**
 * Create new product image
 * @route POST /api/images
 */
export const createImage = asyncHandler(async (req, res) => {
    const { success, data, error } = createImageSchema.safeParse(req.body);

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

    const image = await prisma.productImage.create({
        data,
        include: {
            product: true
        }
    });

    ApiResponse.success(res, { image }, 'Image created successfully', HTTP_STATUS.CREATED);
});

/**
 * Update product image
 * @route PUT /api/images/:id
 */
export const updateImage = asyncHandler(async (req, res) => {
    const { success: idSuccess, data: idData } = imageIdSchema.safeParse({ id: req.params.id });

    if (!idSuccess) {
        return ApiResponse.error(res, 'Invalid image ID format', HTTP_STATUS.BAD_REQUEST);
    }

    const { success: bodySuccess, data: bodyData, error } = updateImageSchema.safeParse(req.body);

    if (!bodySuccess) {
        return ApiResponse.validationError(res, error.errors);
    }

    const image = await prisma.productImage.update({
        where: { id: idData.id },
        data: bodyData,
        include: {
            product: true
        }
    });

    ApiResponse.success(res, { image }, 'Image updated successfully');
});

/**
 * Delete product image
 * @route DELETE /api/images/:id
 */
export const deleteImage = asyncHandler(async (req, res) => {
    const { success, data } = imageIdSchema.safeParse({ id: req.params.id });

    if (!success) {
        return ApiResponse.error(res, 'Invalid image ID format', HTTP_STATUS.BAD_REQUEST);
    }

    await prisma.productImage.delete({
        where: { id: data.id }
    });

    ApiResponse.success(res, {}, 'Image deleted successfully');
});
