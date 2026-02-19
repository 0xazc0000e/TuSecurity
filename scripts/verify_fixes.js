const sqlite3 = require('sqlite3').verbose();
const path = require('path');
// server import removed to prevent auto-start
// Since requiring server might start it, let's just test DB directly for persistence
// and rely on manual/unit test logic for controllers if possible.
// Actually, better to test endpoints if server is running, but let's test DB logic first.

const DB_PATH = path.join(__dirname, '../backend/cyberclub.db');
const db = new sqlite3.Database(DB_PATH);

async function verifyContent() {
    return new Promise((resolve, reject) => {
        // 1. Insert Content
        const title = "Test Content " + Date.now();
        db.run(`INSERT INTO content (title, body, type, category, status) VALUES (?, 'Body', 'news', 'general', 'published')`, [title], function (err) {
            if (err) return reject(err);
            const id = this.lastID;
            console.log(`Inserted content with ID: ${id}`);

            // 2. Retrieve Content (Simulating getAllContent query)
            db.all('SELECT * FROM content WHERE id = ?', [id], (err, rows) => {
                if (err) return reject(err);
                if (rows.length > 0 && rows[0].title === title) {
                    console.log("✅ Content persistence verified.");
                    resolve();
                } else {
                    reject(new Error("Content not found after insertion"));
                }
            });
        });
    });
}

async function verifyProfileUpdate() {
    return new Promise((resolve, reject) => {
        // 1. Get first user
        db.get('SELECT * FROM users LIMIT 1', [], (err, user) => {
            if (err) return reject(err);
            if (!user) {
                console.log("No users found to test profile update.");
                return resolve();
            }

            const newUsername = 'UpdatedUser' + Math.floor(Math.random() * 1000);
            const originalUsername = user.username;

            console.log(`Testing update for user ${user.id}: ${originalUsername} -> ${newUsername}`);

            // 2. Perform Update (Simulating profileRoutes logic)
            db.run('UPDATE users SET username = ? WHERE id = ?', [newUsername, user.id], function (err) {
                if (err) return reject(err);

                // 3. Verify Update
                db.get('SELECT username FROM users WHERE id = ?', [user.id], (err, row) => {
                    if (err) return reject(err);
                    if (row.username === newUsername) {
                        console.log("✅ Profile username update verified.");
                        // Revert
                        db.run('UPDATE users SET username = ? WHERE id = ?', [originalUsername, user.id], () => {
                            resolve();
                        });
                    } else {
                        reject(new Error("Username not updated"));
                    }
                });
            });
        });
    });
}

db.serialize(async () => {
    try {
        await verifyContent();
        await verifyProfileUpdate();
        console.log("All verifications passed.");
        db.close();
    } catch (err) {
        console.error("Verification failed:", err);
        db.close();
        process.exit(1);
    }
});
