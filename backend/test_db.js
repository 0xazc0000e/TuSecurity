const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cyberclub.db', (err) => {
    if (err) {
        console.error('Connection error:', err);
        process.exit(1);
    } else {
        console.log('Connected natively.');
        db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
            console.log('Users:', row);
            process.exit(0);
        });
    }
});
