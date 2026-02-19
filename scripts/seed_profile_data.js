const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../backend/cyberclub.db');
const db = new sqlite3.Database(DB_PATH);

const events = [
    {
        title: 'ورشة عمل: أساسيات اختبار الاختراق',
        type: 'workshop',
        date: new Date(Date.now() + 86400000 * 2).toISOString(), // +2 days
        time: '18:00',
        location: 'معمل الأمن السيبراني (B3)',
        description: 'تعلم أساسيات اختبار الاختراق الأخلاقي وأدوات Kali Linux.',
        link: 'https://zoom.us/j/123456789'
    },
    {
        title: 'مسابقة CTF الشهرية',
        type: 'competition',
        date: new Date(Date.now() + 86400000 * 7).toISOString(), // +7 days
        time: '16:00',
        location: 'Online',
        description: 'تنافس مع زملائك في حل تحديات Capture The Flag.',
        link: 'https://ctf.tu.edu.sa'
    },
    {
        title: 'لقاء مع خبير: مستقبل الذكاء الاصطناعي في الأمن',
        type: 'webinar',
        date: new Date(Date.now() + 86400000 * 14).toISOString(), // +14 days
        time: '20:00',
        location: 'Zoom',
        description: 'نقاش مفتوح مع د. أحمد حول تأثير AI على الأمن السيبراني.',
        link: 'https://zoom.us/j/987654321'
    },
    {
        title: 'دورة بايثون للأمن السيبراني',
        type: 'course',
        date: new Date(Date.now() - 86400000 * 5).toISOString(), // -5 days (past)
        time: '17:00',
        location: 'القاعة الرئيسية',
        description: 'كيفية استخدام Python لأتمتة مهام الأمن.',
        link: null
    }
];

const activities = [
    { type: 'lesson_complete', description: 'أتممت درس "مقدمة في الشبكات"', xp: 50 },
    { type: 'quiz_pass', description: 'اجتزت اختبار "أساسيات Linux" بنسبة 90%', xp: 100 },
    { type: 'badge_earned', description: 'حصلت على شارة "مبتدئ محترف"', xp: 500 },
    { type: 'login', description: 'تسجيل دخول يومي (5 أيام متتالية)', xp: 20 }
];

db.serialize(() => {
    console.log('Seeding profile data...');

    // Users
    db.get("SELECT id FROM users LIMIT 1", (err, user) => {
        if (err || !user) {
            console.error("No users found. Run standard seed first.");
            return;
        }
        const userId = user.id;
        console.log(`Seeding for user ID: ${userId}`);

        // Events
        db.run("DELETE FROM club_events");
        const stmt = db.prepare("INSERT INTO club_events (title, type, date, time, location, description, link) VALUES (?, ?, ?, ?, ?, ?, ?)");
        events.forEach(e => {
            stmt.run(e.title, e.type, e.date, e.time, e.location, e.description, e.link);
        });
        stmt.finalize();
        console.log("Events seeded.");

        // Bookmarks
        db.run("DELETE FROM bookmarks");
        db.run("INSERT INTO bookmarks (user_id, item_id, item_type, note, folder_id) VALUES (?, ?, ?, ?, ?)", [userId, 1, 'article', 'مقال ممتاز عن التشفير', null]);
        db.run("INSERT INTO bookmarks (user_id, item_id, item_type, note, folder_id) VALUES (?, ?, ?, ?, ?)", [userId, 1, 'lesson', 'مراجعة لاحقاً', null]);
        console.log("Bookmarks seeded.");

        // Likes
        db.run("DELETE FROM likes");
        db.run("INSERT INTO likes (user_id, item_id, item_type) VALUES (?, ?, ?)", [userId, 2, 'article']);
        console.log("Likes seeded.");

        // Reading List
        db.run("DELETE FROM reading_list");
        db.run("INSERT INTO reading_list (user_id, item_id, item_type) VALUES (?, ?, ?)", [userId, 3, 'article']);
        console.log("Reading list seeded.");

        // Activity
        db.run("DELETE FROM user_activity WHERE user_id = ?", [userId]);
        const actStmt = db.prepare("INSERT INTO user_activity (user_id, activity_type, description, xp_earned) VALUES (?, ?, ?, ?)");
        activities.forEach(a => {
            actStmt.run(userId, a.type, a.description, a.xp);
        });
        actStmt.finalize();
        console.log("User activity seeded.");

        // Bookmark Folders
        db.run("DELETE FROM bookmark_folders");
        db.run("INSERT INTO bookmark_folders (user_id, name, icon) VALUES (?, ?, ?)", [userId, 'شروحات مهمة', '📂']);
        console.log("Bookmark folders seeded.");

        // Goals (Already handled in profileRoutes if missing, but let's seed some custom)
        db.run("DELETE FROM user_goals WHERE user_id = ?", [userId]);
        db.run("INSERT INTO user_goals (user_id, goal_type, target_value, current_value) VALUES (?, 'xp', 1000, 750)", [userId]);
        db.run("INSERT INTO user_goals (user_id, goal_type, target_value, current_value) VALUES (?, 'lessons', 10, 3)", [userId]);
        db.run("INSERT INTO user_goals (user_id, goal_type, target_value, current_value) VALUES (?, 'streak', 14, 5)", [userId]);
        console.log("User goals seeded.");

    });
});

db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Database connection closed.');
});
