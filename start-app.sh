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
check_port 3001 || echo "   (Backend port 3001)"
check_port 5174 || echo "   (Frontend port 5174)"

# Start Backend
echo ""
echo "🔧 Starting Backend..."
cd /home/azo/Documents/tu_clup_cyper_the_end111/backend

# Create simple server if main server fails
cat > simple-backend.js << 'EOF'
const http = require('http');

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.url === '/test') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            message: 'Simple backend working!', 
            time: new Date().toISOString() 
        }));
    } else if (req.url === '/api/auth/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const data = JSON.parse(body);
            if (data.email === 'admin@tu.edu.sa' && data.password === 'admin123') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    token: 'mock-token',
                    user: { id: 1, email: data.email, role: 'admin' }
                }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid credentials' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

server.listen(3001, '0.0.0.0', () => {
    console.log('✅ Simple backend running on http://localhost:3001');
    console.log('📡 Test: curl http://localhost:3001/test');
});
EOF

# Start simple backend
node simple-backend.js &
BACKEND_PID=$!

echo "🔧 Backend started (PID: $BACKEND_PID)"

# Wait a moment for backend to start
sleep 2

# Test backend
echo "📋 Testing backend..."
if curl -s http://localhost:3001/test > /dev/null; then
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
echo "📱 Frontend: http://localhost:5174"
echo "🔧 Backend:  http://localhost:3001"
echo ""
echo "🔧 Test Login:"
echo "   Email:    admin@tu.edu.sa"
echo "   Password: admin123"
echo ""
echo "⏹️  Press Ctrl+C to stop"

# Wait for user to stop
wait
