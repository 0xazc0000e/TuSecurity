#!/bin/bash

echo "🔧 Starting TUCC Backend Server..."

# Set environment variables
export PORT=3001
export DB_PATH="./cyberclub.db"
export JWT_SECRET="tu-cyber-security-secret-key-2024"
export FRONTEND_URL="http://localhost:5174"

# Initialize database
echo "📊 Initializing database..."
node -e "
const { initializeDatabase } = require('./models/database');
initializeDatabase()
  .then(() => {
    console.log('✅ Database initialized');
    require('./server.js');
  })
  .catch((err) => {
    console.error('❌ Database error:', err);
    process.exit(1);
  });
"
