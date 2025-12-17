# PERN E-Commerce Backend

A production-ready e-commerce backend built with PostgreSQL, Express, React (planned), and Node.js (PERN stack).

## 🚀 Features

- **RESTful API** with industry-standard architecture
- **Authentication & Authorization** with JWT
- **Role-Based Access Control** (Admin/Customer)
- **Product Management** with categories, images, and variants
- **Shopping Cart** functionality
- **Security** with Helmet, CORS, and rate limiting
- **Database** with Prisma ORM and PostgreSQL
- **Logging** with Winston and Morgan
- **Error Handling** with comprehensive error middleware
- **Code Quality** with ESLint and Prettier
- **Input Validation** with Zod schemas

## 📁 Project Structure

```
pern-ecom-backend/
├── src/
│   ├── config/          # Configuration files
│   ├── constants/       # Constants (HTTP status, messages, roles)
│   ├── controllers/     # Request handlers
│   ├── database/        # Database connection
│   ├── middleware/      # Custom middleware
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── validators/      # Zod validation schemas
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── logs/                # Application logs
├── .env.example         # Environment variables template
└── package.json
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pern-ecom-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   npm run db:migrate
   npm run db:generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

Required environment variables (see `.env.example`):

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT expiration time (default: 7d)
- `CORS_ORIGIN` - Allowed CORS origin (default: *)
- `LOG_LEVEL` - Logging level (default: info)

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-in` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Product Endpoints

- `GET /api/products` - Get all products (with pagination, filtering)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Category Endpoints

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Cart Endpoints

- `GET /api/cart` - Get cart (by userId or sessionId)
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart
- `DELETE /api/cart/:id/clear` - Clear cart

### Image & Variant Endpoints

- `GET /api/images` - Get all product images
- `POST /api/images` - Create product image (admin only)
- `GET /api/variants` - Get all product variants
- `POST /api/variants` - Create product variant (admin only)

## 🧪 Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🔒 Security Features

- **Helmet** - Sets security-related HTTP headers
- **CORS** - Configurable cross-origin resource sharing
- **Rate Limiting** - Prevents brute-force attacks
- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - Zod schema validation
- **Error Handling** - Comprehensive error middleware

## 🏗️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Zod
- **Logging**: Winston + Morgan
- **Security**: Helmet, CORS, express-rate-limit
- **Code Quality**: ESLint, Prettier

## 📝 License

ISC

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
