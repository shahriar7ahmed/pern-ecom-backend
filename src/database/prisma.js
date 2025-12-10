import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
import { createRequire } from 'module';
import { Pool } from 'pg';

// Import PrismaClient - the default.js workaround handles the circular dependency
const require = createRequire(import.meta.url);

// Try to get PrismaClient directly, with fallback
let PrismaClient;
try {
  const pkg = require('@prisma/client');
  PrismaClient = pkg.PrismaClient;
  
  // If still undefined due to circular dependency, wait a tick and try again
  if (!PrismaClient || typeof PrismaClient !== 'function') {
    await new Promise(resolve => setImmediate(resolve));
    const pkg2 = require('@prisma/client');
    PrismaClient = pkg2.PrismaClient;
  }
} catch (error) {
  throw new Error(`Failed to load PrismaClient: ${error.message}. Make sure to run 'npm run db:generate' first.`);
}

if (!PrismaClient || typeof PrismaClient !== 'function') {
  throw new Error('PrismaClient is not available. Please run "npm run db:generate" and ensure Prisma Client is properly generated.');
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ 
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  await pool.end();
});

export { prisma };
export default prisma;

