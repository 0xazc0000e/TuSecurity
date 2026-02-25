const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'cyberclub.db');
const db = new sqlite3.Database(dbPath);

async function addAdmin() {
    try {
        const passwordHash = await bcrypt.hash('admin123', 10);

        // Add admin@tu.edu.sa
        db.run(
            `INSERT OR IGNORE INTO users (username, email, full_name, password_hash, role, total_xp, is_verified) 
             VALUES ('admin', 'admin@tu.edu.sa', 'Admin User', ?, 'admin', 9999, 1)`,
            [passwordHash],
            function (err) {
                if (err) console.error("Error inserting admin:", err);
                else {
                    console.log('Admin user added or already exists.');
                    // Force update password for admin@tu.edu.sa
                    db.run(`UPDATE users SET password_hash = ?, role = 'admin' WHERE email = 'admin@tu.edu.sa'`, [passwordHash], (err2) => {
                        if (err2) console.error(err2);
                        else console.log('Admin password explicitly set to admin123');
                    });
                }
            }
        );

    } catch (error) {
        console.error("Error:", error);
    } finally {
        setTimeout(() => db.close(), 1000);
    }
}

addAdmin();
