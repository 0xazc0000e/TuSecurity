const { initializeDatabase } = require('./models/database');

console.log('Initializing database...');
initializeDatabase()
  .then(() => {
    console.log('Database initialized successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Database initialization failed:', err);
    process.exit(1);
  });
