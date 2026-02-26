const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Test database connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL database via Prisma');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Database initialization function (for compatibility)
async function initializeDatabase() {
  await testConnection();
  console.log('Prisma database initialized successfully');
}

// Seed data function (for compatibility)
async function seedDatabase() {
  // This would be handled by Prisma seed scripts
  console.log('Database seeding should be handled by Prisma seed scripts');
}

module.exports = {
  prisma,
  initializeDatabase,
  seedDatabase,
  testConnection
};
