// Redis client - used as an optional feature
// If Redis is not available, this module exports a null-safe stub so the server can still run
const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        connectTimeout: 2000, // fail fast (2 sec) if Redis is not running
        reconnectStrategy: false, // don't keep retrying
    }
});

redisClient.on('error', (err) => {
    // Suppress Redis connection errors to avoid crashing the server
    if (process.env.NODE_ENV !== 'production') {
        console.warn('[Redis] Not connected:', err.message);
    }
});
redisClient.on('connect', () => console.log('[Redis] Connected to Redis server'));

// Connect - but don't crash if Redis isn't running
(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.warn('[Redis] Skipping Redis — server will use in-memory fallback for rate limiting.');
    }
})();

module.exports = redisClient;
