import { prisma } from '../database/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema
} from '../validators/categoryValidator.js';

/**
 * Get all categories with pagination
 * @route GET /api/categories
 */
export const getAllCategories = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, parentId } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  // Build where clause
  const where = {};
  if (parentId) where.parentId = parentId;
  if (parentId === 'null') where.parentId = null; // Root categories

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      include: {
        parent: true,
        subcategories: true,
        _count: {
          select: { products: true }
        }
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.category.count({ where })
  ]);

  ApiResponse.success(res, {
    categories,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / take)
    }
  }, MESSAGES.FETCHED);
});

/**
 * Get category by ID
 * @route GET /api/categories/:id
 */
export const getCategoryById = asyncHandler(async (req, res) => {
  const { success, data } = categoryIdSchema.safeParse({ id: req.params.id });

  if (!success) {
    return ApiResponse.error(res, 'Invalid category ID format', HTTP_STATUS.BAD_REQUEST);
  }

  const category = await prisma.category.findUnique({
    where: { id: data.id },
    include: {
      parent: true,
      subcategories: true,
      products: {
        take: 10,
        include: {
          images: {
            where: { isPrimary: true },
            take: 1
          }
        }
      }
    }
  });

  if (!category) {
    return ApiResponse.notFound(res, MESSAGES.CATEGORY_NOT_FOUND);
  }

  ApiResponse.success(res, { category }, MESSAGES.FETCHED);
});

/**
 * Create new category
 * @route POST /api/categories
 */
export const createCategory = asyncHandler(async (req, res) => {
  const { success, data, error } = createCategorySchema.safeParse(req.body);

  if (!success) {
    return ApiResponse.validationError(res, error.errors);
  }

  // If parentId is provided, check if parent exists
  if (data.parentId) {
    const parentCategory = await prisma.category.findUnique({
      where: { id: data.parentId }
    });

    if (!parentCategory) {
      return ApiResponse.notFound(res, 'Parent category not found');
    }
  }

  const category = await prisma.category.create({
    data,
    include: {
      parent: true
    }
  });

  ApiResponse.success(res, { category }, MESSAGES.CATEGORY_CREATED, HTTP_STATUS.CREATED);
});

/**
 * Update category
 * @route PUT /api/categories/:id
 */
export const updateCategory = asyncHandler(async (req, res) => {
  const { success: idSuccess, data: idData } = categoryIdSchema.safeParse({ id: req.params.id });

  if (!idSuccess) {
    return ApiResponse.error(res, 'Invalid category ID format', HTTP_STATUS.BAD_REQUEST);
  }

  const { success: bodySuccess, data: bodyData, error } = updateCategorySchema.safeParse(req.body);

  if (!bodySuccess) {
    return ApiResponse.validationError(res, error.errors);
  }

  // If parentId is being updated, verify it exists
  if (bodyData.parentId) {
    const parentCategory = await prisma.category.findUnique({
      where: { id: bodyData.parentId }
    });

    if (!parentCategory) {
      return ApiResponse.notFound(res, 'Parent category not found');
    }
  }

  const category = await prisma.category.update({
    where: { id: idData.id },
    data: bodyData,
    include: {
      parent: true,
      subcategories: true
    }
  });

  ApiResponse.success(res, { category }, MESSAGES.CATEGORY_UPDATED);
});

/**
 * Delete category
 * @route DELETE /api/categories/:id
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const { success, data } = categoryIdSchema.safeParse({ id: req.params.id });

  if (!success) {
    return ApiResponse.error(res, 'Invalid category ID format', HTTP_STATUS.BAD_REQUEST);
  }

  await prisma.category.delete({
    where: { id: data.id }
  });

  ApiResponse.success(res, {}, MESSAGES.CATEGORY_DELETED);
});