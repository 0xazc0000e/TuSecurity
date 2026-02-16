#!/bin/bash

echo "🔧 TUCC Platform - Quick Fix Script"
echo "=================================="

# Kill existing processes
echo "🔄 Cleaning up..."
pkill -f "node" 2>/dev/null || true
sleep 2

# Navigate to project
cd /home/azo/Documents/tu_clup_cyper_the_end111

# Start simple backend
echo "🚀 Starting Simple Backend..."
cd backend
node simple-server.js &
BACKEND_PID=$!
cd ..

# Wait for backend
sleep 3

# Test backend
echo "🧪 Testing Backend..."
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Backend is running"
else
    echo "❌ Backend failed to start"
    exit 1
fi

# Start frontend
echo "🎨 Starting Frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Platform is ready!"
echo "======================"
echo "📱 Frontend: http://localhost:5174"
echo "🔧 Backend:  http://localhost:3001"
echo ""
echo "🔑 Login Credentials:"
echo "   Email:    admin@tu.edu.sa"
echo "   Password: admin123"
echo ""
echo "📚 Test Articles Page:"
echo "   1. Login with credentials above"
echo "   2. Navigate to Articles page"
echo "   3. Test the LMS interface"
echo ""
echo "⏹️  Press Ctrl+C to stop"

# Wait for user
wait
