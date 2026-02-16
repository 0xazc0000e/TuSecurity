
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'cyberclub.db');
const db = new sqlite3.Database(dbPath);

console.log("🌱 Seeding Database...");

db.serialize(() => {
    // 1. Create a Track
    db.run(`INSERT INTO tracks (title, description, icon) VALUES ('مسار اختبار الاختراق', 'تعلم أساسيات الهجوم والدفاع', 'Shield')`, function (err) {
        if (err) return console.log(err.message);
        const trackId = this.lastID;
        console.log(`Created Track ID: ${trackId}`);

        // 2. Create a Course
        db.run(`INSERT INTO courses (track_id, title, description) VALUES (?, 'الشبكات الهجومية', 'فحص وتحليل الشبكات')`, [trackId], function (err) {
            const courseId = this.lastID;
            console.log(`Created Course ID: ${courseId}`);

            // 3. Create a Unit
            db.run(`INSERT INTO units (course_id, title) VALUES (?, 'مقدمة في Nmap')`, [courseId], function (err) {
                const unitId = this.lastID;
                console.log(`Created Unit ID: ${unitId}`);

                // 4. Create a Lesson
                db.run(`INSERT INTO lessons (unit_id, title, content, xp_reward) VALUES (?, 'شرح أوامر الفحص', '# مقدمة\nأهلاً بك في عالم الهاكر.\n\n## الكود:\n\`\`\`bash\nnmap -sV 192.168.1.1\n\`\`\`', 50)`, [unitId], function (err) {
                    console.log(`Created Lesson ID: ${this.lastID}`);
                    console.log("✅ Database Seeded Successfully!");
                    db.close();
                });
            });
        });
    });
});