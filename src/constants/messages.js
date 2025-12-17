/**
 * Standard response messages
 */

export const MESSAGES = {
    // Success messages
    SUCCESS: 'Operation completed successfully',
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    FETCHED: 'Resource fetched successfully',

    // Auth messages
    SIGNUP_SUCCESS: 'User registered successfully',
    SIGNIN_SUCCESS: 'User signed in successfully',
    LOGOUT_SUCCESS: 'User logged out successfully',
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'You do not have permission to perform this action',
    TOKEN_EXPIRED: 'Token has expired',
    TOKEN_INVALID: 'Invalid token',

    // Error messages
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation failed',
    INTERNAL_ERROR: 'Internal server error',
    BAD_REQUEST: 'Bad request',
    DUPLICATE: 'Resource already exists',

    // User messages
    USER_NOT_FOUND: 'User not found',
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully',

    // Product messages
    PRODUCT_NOT_FOUND: 'Product not found',
    PRODUCT_CREATED: 'Product created successfully',
    PRODUCT_UPDATED: 'Product updated successfully',
    PRODUCT_DELETED: 'Product deleted successfully',

    // Category messages
    CATEGORY_NOT_FOUND: 'Category not found',
    CATEGORY_CREATED: 'Category created successfully',
    CATEGORY_UPDATED: 'Category updated successfully',
    CATEGORY_DELETED: 'Category deleted successfully',

    // Cart messages
    CART_FETCHED: 'Cart fetched successfully',
    CART_ITEM_ADDED: 'Item added to cart successfully',
    CART_ITEM_UPDATED: 'Cart item updated successfully',
    CART_ITEM_REMOVED: 'Item removed from cart successfully',
    CART_CLEARED: 'Cart cleared successfully',
};
