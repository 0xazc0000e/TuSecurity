const sqlite3 = require('sqlite3').verbose();

async function queryDb(dbPath, name) {
    return new Promise((resolve) => {
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error(name, 'Error connecting:', err.message);
                return resolve();
            }

            let admins = [];
            let lessonsCount = 0;
            let eventsCount = 0;

            db.serialize(() => {
                db.all("SELECT id, username, role FROM users WHERE role='admin'", (err, rows) => {
                    if (rows) admins = rows;
                });
                db.get("SELECT count(*) as count FROM lessons", (err, row) => {
                    if (row) lessonsCount = row.count;
                });
                db.get("SELECT count(*) as count FROM club_events", (err, row) => {
                    if (row) eventsCount = row.count;
                });
            });

            // Wait a bit for queries to finish then close and resolve
            setTimeout(() => {
                console.log(`--- ${name} ---`);
                console.log('Admins:', admins);
                console.log('Lessons:', lessonsCount);
                console.log('Events:', eventsCount);
                db.close();
                resolve();
            }, 1000);
        });
    });
}

async function main() {
    await queryDb('./cyberclub.db', 'cyberclub.db');
    await queryDb('./cyberclub2.db', 'cyberclub2.db');
}

main();
