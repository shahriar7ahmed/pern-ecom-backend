import { prisma } from '../database/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';
import {
  createProductSchema,
  updateProductSchema,
  productIdSchema
} from '../validators/productValidator.js';

/**
 * Get all products with pagination and filtering
 * @route GET /api/products
 */
export const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, categoryId, isFeatured, isActive, search } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  // Build where clause
  const where = {};
  if (categoryId) where.categoryId = categoryId;
  if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';
  if (isActive !== undefined) where.isActive = isActive === 'true';
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          where: { isPrimary: true },
          take: 1
        },
        _count: {
          select: { variants: true }
        }
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.product.count({ where })
  ]);

  ApiResponse.success(res, {
    products,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / take)
    }
  }, MESSAGES.FETCHED);
});

/**
 * Get single product by ID
 * @route GET /api/products/:id
 */
export const getProductById = asyncHandler(async (req, res) => {
  const { success, data } = productIdSchema.safeParse({ id: req.params.id });

  if (!success) {
    return ApiResponse.error(res, 'Invalid product ID format', HTTP_STATUS.BAD_REQUEST);
  }

  const product = await prisma.product.findUnique({
    where: { id: data.id },
    include: {
      category: true,
      images: {
        orderBy: { displayOrder: 'asc' }
      },
      variants: true
    }
  });

  if (!product) {
    return ApiResponse.notFound(res, MESSAGES.PRODUCT_NOT_FOUND);
  }

  ApiResponse.success(res, { product }, MESSAGES.FETCHED);
});

/**
 * Create new product
 * @route POST /api/products
 */
export const createProduct = asyncHandler(async (req, res) => {
  const { success, data, error } = createProductSchema.safeParse(req.body);

  if (!success) {
    return ApiResponse.validationError(res, error.errors);
  }

  // Check if category exists
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId }
  });

  if (!category) {
    return ApiResponse.notFound(res, MESSAGES.CATEGORY_NOT_FOUND);
  }

  const product = await prisma.product.create({
    data,
    include: {
      category: true
    }
  });

  ApiResponse.success(res, { product }, MESSAGES.PRODUCT_CREATED, HTTP_STATUS.CREATED);
});

/**
 * Update product
 * @route PUT /api/products/:id
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const { success: idSuccess, data: idData } = productIdSchema.safeParse({ id: req.params.id });

  if (!idSuccess) {
    return ApiResponse.error(res, 'Invalid product ID format', HTTP_STATUS.BAD_REQUEST);
  }

  const { success: bodySuccess, data: bodyData, error } = updateProductSchema.safeParse(req.body);

  if (!bodySuccess) {
    return ApiResponse.validationError(res, error.errors);
  }

  // If categoryId is being updated, verify it exists
  if (bodyData.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: bodyData.categoryId }
    });

    if (!category) {
      return ApiResponse.notFound(res, MESSAGES.CATEGORY_NOT_FOUND);
    }
  }

  const product = await prisma.product.update({
    where: { id: idData.id },
    data: bodyData,
    include: {
      category: true,
      images: true,
      variants: true
    }
  });

  ApiResponse.success(res, { product }, MESSAGES.PRODUCT_UPDATED);
});

/**
 * Delete product
 * @route DELETE /api/products/:id
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const { success, data } = productIdSchema.safeParse({ id: req.params.id });

  if (!success) {
    return ApiResponse.error(res, 'Invalid product ID format', HTTP_STATUS.BAD_REQUEST);
  }

  await prisma.product.delete({
    where: { id: data.id }
  });

  ApiResponse.success(res, {}, MESSAGES.PRODUCT_DELETED);
});