const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.resolve(__dirname, 'cyberclub.db');
const db = new sqlite3.Database(dbPath);

const targetUser = {
    username: 'Azo',
    email: 'az.jo.fm@gmail.com',
    password: 'password123', // Temporary password
    role: 'admin'
};

function runQuery(query, params) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

function getQuery(query, params) {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

async function promoteOrCreate() {
    try {
        console.log(`Processing user: ${targetUser.email}`);

        const row = await getQuery("SELECT * FROM users WHERE email = ?", [targetUser.email]);
        const passwordHash = await bcrypt.hash(targetUser.password, 10);

        if (row) {
            console.log(`User exists (ID: ${row.id}). Updating role to ADMIN...`);
            await runQuery("UPDATE users SET role = 'admin' WHERE email = ?", [targetUser.email]);
            console.log("User updated successfully.");
        } else {
            console.log("User does NOT exist. Creating new ADMIN user...");
            const result = await runQuery(
                `INSERT INTO users (username, email, password_hash, role, total_xp) VALUES (?, ?, ?, ?, ?)`,
                [targetUser.username, targetUser.email, passwordHash, 'admin', 9999]
            );
            console.log(`User created successfully with ID: ${result.lastID}`);
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        db.close((err) => {
            if (err) console.error("Error closing DB:", err.message);
            else console.log("Database connection closed.");
            process.exit(0);
        });
    }
}

promoteOrCreate();
