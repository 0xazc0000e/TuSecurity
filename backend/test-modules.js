// Test basic Node.js functionality
console.log('🔧 Testing Node.js...');

try {
    // Test require
    const path = require('path');
    console.log('✅ Path module loaded');
    
    // Test express
    const express = require('express');
    console.log('✅ Express module loaded');
    
    // Test sqlite3
    const sqlite3 = require('sqlite3');
    console.log('✅ SQLite3 module loaded');
    
    // Test bcrypt
    const bcrypt = require('bcrypt');
    console.log('✅ Bcrypt module loaded');
    
    // Test jwt
    const jwt = require('jsonwebtoken');
    console.log('✅ JWT module loaded');
    
    // Test cors
    const cors = require('cors');
    console.log('✅ CORS module loaded');
    
    console.log('🎉 All modules loaded successfully!');
    
} catch (error) {
    console.error('❌ Error loading modules:', error.message);
    process.exit(1);
}
