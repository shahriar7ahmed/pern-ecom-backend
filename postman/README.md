# Postman API Testing Collection

## Quick Start

1. **Import Collection**: Import `PERN-Ecommerce-API.postman_collection.json` into Postman
2. **Import Environment**: Import `PERN-Ecommerce-Local.postman_environment.json`
3. **Select Environment**: Choose "PERN E-commerce - Local" from dropdown (top right)
4. **Start Testing**: Begin with Auth → Sign Up → Sign In

## What's Fixed? ✅

All API paths now correctly match the backend:
- ✓ `/api/auth/*` - Authentication routes
- ✓ `/api/users/*` - User management
- ✓ `/api/categories/*` - Category management (was `/category`)
- ✓ `/api/products/*` - Product management (was `/product`)
- ✓ `/api/variants/*` - Product variants
- ✓ `/api/images/*` - Product images
- ✓ `/api/cart/*` - Shopping cart
- ✓ `/api/orders/*` - Order management (was `/order`)

## Included Endpoints

- **Auth** (3): Sign Up, Sign In, Get Current User
- **Users** (4): Get All, Get By ID, Update, Delete
- **Categories** (5): CRUD + Subcategories
- **Products** (5): CRUD operations
- **Variants** (5): CRUD + multiple variant types
- **Images** (3): Add, Get All, Get By ID
- **Cart** (5): Get, Add Item, Update, Remove, Clear
- **Orders** (5): Get All, Get By ID, Create, Update Status, Delete

## Environment Variables

The following variables are automatically set when you run requests:
- `accessToken` - JWT authentication token
- `userId`, `categoryId`, `productId`, `variantId`, `imageId`, `cartItemId`, `orderId`

## Files

- `PERN-Ecommerce-API.postman_collection.json` - Complete API collection
- `PERN-Ecommerce-API.postman_collection.json.backup` - Backup of original (pre-fix)
- `PERN-Ecommerce-Local.postman_environment.json` - Local environment variables

## Documentation

For detailed usage guide, see the comprehensive documentation in the artifacts folder.

## Running Tests

Make sure your backend server is running:
```bash
npm run dev
```

Server should be accessible at: `http://localhost:3000`
