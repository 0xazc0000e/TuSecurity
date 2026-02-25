#!/bin/bash

echo "🚀 Starting TUCC Application..."
echo "================================"

# Function to check if port is in use
check_port() {
    if netstat -tlnp 2>/dev/null | grep -q ":$1 "; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

# Check ports
echo "📋 Checking ports..."
check_port 5000 || echo "   (Backend port 5000)"
check_port 5173 || echo "   (Frontend port 5173)"

# Start Backend
echo ""
echo "🔧 Starting Backend..."
cd /home/azo/Documents/tu_clup_cyper_the_end111/backend

# Read PORT from backend/.env or default to 5000
BACKEND_PORT=$(grep -oP '(?<=^PORT=).*' .env | tr -d '\r' || echo 5000)

export PORT=$BACKEND_PORT
node server.js &
BACKEND_PID=$!

echo "🔧 Backend started (PID: $BACKEND_PID) on port $BACKEND_PORT"

# Wait a moment for backend to start
sleep 2

# Test backend
echo "📋 Testing backend..."
if curl -s http://localhost:$BACKEND_PORT/api > /dev/null; then
    echo "✅ Backend is responding"
else
    echo "❌ Backend not responding"
fi

# Start Frontend
echo ""
echo "🎨 Starting Frontend..."
cd /home/azo/Documents/tu_clup_cyper_the_end111

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend
npm run dev &
FRONTEND_PID=$!

echo "🎨 Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "🎉 Application started!"
echo "========================"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:$BACKEND_PORT/api"
echo ""
echo "🔧 Test Login:"
echo "   Use your actual admin or user credentials."
echo ""
echo "⏹️  Press Ctrl+C to stop"

# Wait for user to stop
wait
