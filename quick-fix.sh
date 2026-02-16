#!/bin/bash

echo "🔧 Quick Backend Fix"
echo "==================="

# Kill any existing processes
echo "🔄 Cleaning up..."
pkill -f "node" 2>/dev/null || true

# Navigate to backend
cd /home/azo/Documents/tu_clup_cyper_the_end111/backend

# Create ultra-simple server
cat > ultra-simple.js << 'EOF'
const http = require('http');

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Routes
    if (req.url === '/test' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            message: 'Backend working!', 
            time: new Date().toISOString() 
        }));
    }
    else if (req.url === '/api/auth/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                console.log('Login attempt:', data.email);
                
                if (data.email === 'admin@tu.edu.sa' && data.password === 'admin123') {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        token: 'mock-jwt-token-12345',
                        user: {
                            id: 1,
                            username: 'admin',
                            email: 'admin@tu.edu.sa',
                            role: 'admin'
                        }
                    }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: 'Invalid email or password'
                    }));
                }
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Invalid request'
                }));
            }
        });
    }
    else if (req.url === '/api/auth/register' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                console.log('Register attempt:', data.email);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    message: 'User registered successfully',
                    user: {
                        id: Date.now(),
                        username: data.username,
                        email: data.email,
                        role: 'student'
                    }
                }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Invalid request'
                }));
            }
        });
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Endpoint not found' }));
    }
});

server.listen(3001, '0.0.0.0', () => {
    console.log('🚀 Ultra-simple backend running!');
    console.log('📡 Server: http://localhost:3001');
    console.log('🔧 Test: curl http://localhost:3001/test');
    console.log('👤 Login: POST http://localhost:3001/api/auth/login');
    console.log('📝 Register: POST http://localhost:3001/api/auth/register');
    console.log('');
    console.log('🔧 Test Credentials:');
    console.log('   Email: admin@tu.edu.sa');
    console.log('   Password: admin123');
});
EOF

# Start the server
echo "🚀 Starting ultra-simple backend..."
node ultra-simple.js
