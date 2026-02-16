#!/bin/bash

echo "🚀 Starting TUCC Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Navigate to backend directory
cd /home/azo/Documents/tu_clup_cyper_the_end111/backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Set environment variables
export PORT=3001
export DB_PATH="./cyberclub.db"
export JWT_SECRET="tu-cyber-security-secret-key-2024"
export FRONTEND_URL="http://localhost:5174"

echo "🔧 Environment variables set:"
echo "   PORT: $PORT"
echo "   DB_PATH: $DB_PATH"
echo "   FRONTEND_URL: $FRONTEND_URL"

# Start the server
echo "🚀 Starting server..."
node server.js
