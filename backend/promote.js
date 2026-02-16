const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// الاتصال بقاعدة البيانات
const dbPath = path.resolve(__dirname, 'cyberclub.db');
const db = new sqlite3.Database(dbPath);

const emailToPromote = 'az.jo.fm@gmail.com';

console.log(`Promoting user: ${emailToPromote}...`);

db.serialize(() => {
    // 1. نتأكد أولاً هل المستخدم موجود؟
    db.get("SELECT * FROM users WHERE email = ?", [emailToPromote], (err, row) => {
        if (err) {
            console.error("Error finding user:", err.message);
            db.close(); // نغلق هنا في حال وجود خطأ
            return;
        }
        if (!row) {
            console.error("User NOT found!");
            db.close(); // نغلق هنا في حال عدم وجود المستخدم
            return;
        }

        console.log(`Found user: ${row.username} (Current role: ${row.role})`);

        // 2. نقوم بتحديث الرتبة
        db.run("UPDATE users SET role = 'admin' WHERE email = ?", [emailToPromote], function (err) {
            if (err) {
                console.error("Error updating role:", err.message);
            } else {
                console.log(`Success! User ${row.username} is now an ADMIN.`);
            }
            // 3. نغلق قاعدة البيانات هنا فقط بعد الانتهاء
            db.close();
        });
    });
});