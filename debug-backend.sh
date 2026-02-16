#!/bin/bash

echo "🔧 TUCC Backend Debug Script"
echo "=========================="

# Check Node.js
echo "📋 Checking Node.js..."
if command -v node &> /dev/null; then
    echo "✅ Node.js found: $(node --version)"
else
    echo "❌ Node.js not found"
    exit 1
fi

# Check npm
echo "📋 Checking npm..."
if command -v npm &> /dev/null; then
    echo "✅ npm found: $(npm --version)"
else
    echo "❌ npm not found"
    exit 1
fi

# Navigate to backend
cd /home/azo/Documents/tu_clup_cyper_the_end111/backend

# Check dependencies
echo "📋 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules exists"
else
    echo "❌ node_modules missing, installing..."
    npm install
fi

# Test modules
echo "📋 Testing modules..."
node -e "
try {
    require('express');
    require('cors');
    require('sqlite3');
    require('bcrypt');
    require('jsonwebtoken');
    console.log('✅ All modules loaded');
} catch (e) {
    console.log('❌ Module error:', e.message);
    process.exit(1);
}
"

# Create simple test server
echo "🚀 Starting test server..."
cat > test-server.js << 'EOF'
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));

app.get('/test', (req, res) => {
    res.json({ message: 'Test server working!', time: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('✅ Test server running on port', PORT);
});
EOF

# Start test server
node test-server.js
