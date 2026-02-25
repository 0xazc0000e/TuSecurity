module.exports = {
    apps: [
        {
            name: 'tucc-backend',
            script: './backend/server.js',
            instances: 1, // Or 'max' to use all CPU cores
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                PORT: 5000,
                FRONTEND_URL: 'http://localhost', // CHANGE THIS TO YOUR ACTUAL DOMAIN (e.g., https://tu-cyberclub.com)
            },
        },
    ],
};
