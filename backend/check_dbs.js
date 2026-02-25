const sqlite3 = require('sqlite3').verbose();
const db1 = new sqlite3.Database('./cyberclub.db');
const db2 = new sqlite3.Database('./cyberclub2.db');

function queryDb(db, name) {
    db.serialize(() => {
        db.all("SELECT id, username, role FROM users WHERE role='admin'", (err, rows) => {
            console.log(name, 'Admins:', rows);
        });
        db.get("SELECT count(*) as count FROM lessons", (err, row) => {
            console.log(name, 'Lessons:', row ? row.count : 0);
        });
        db.get("SELECT count(*) as count FROM club_events", (err, row) => {
            console.log(name, 'Events:', row ? row.count : 0);
        });
    });
}
queryDb(db1, 'cyberclub.db');
queryDb(db2, 'cyberclub2.db');
