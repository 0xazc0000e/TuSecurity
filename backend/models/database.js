const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

// Database path
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'cyberclub.db');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
    console.log('Connected to SQLite database at:', DB_PATH);
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Database initialization function
function initializeDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // 1. Users Table
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT DEFAULT 'student' CHECK(role IN ('admin', 'editor', 'student')),
                avatar TEXT DEFAULT '/default-avatar.png',
                total_xp INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_active DATETIME,
                status TEXT DEFAULT 'active' CHECK(status IN ('active', 'suspended', 'inactive'))
            )`, (err) => {
                if (err) reject(err);
            });

            // 2. Simulators Table
            db.run(`CREATE TABLE IF NOT EXISTS simulators (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                type TEXT NOT NULL CHECK(type IN ('tool', 'attack')),
                difficulty TEXT NOT NULL CHECK(difficulty IN ('beginner', 'intermediate', 'advanced')),
                category TEXT NOT NULL,
                description TEXT,
                icon TEXT DEFAULT 'Terminal',
                lessons_count INTEGER DEFAULT 0,
                xp_reward INTEGER DEFAULT 0,
                status TEXT DEFAULT 'active' CHECK(status IN ('active', 'maintenance', 'development')),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
                if (err) reject(err);
            });

            // 3. UserProgress Table
            db.run(`CREATE TABLE IF NOT EXISTS user_progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                simulator_id INTEGER NOT NULL,
                current_module INTEGER DEFAULT 0,
                is_completed BOOLEAN DEFAULT 0,
                score INTEGER DEFAULT 0,
                completed_lessons TEXT DEFAULT '[]',
                role_data TEXT DEFAULT '{}',
                last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (simulator_id) REFERENCES simulators(id) ON DELETE CASCADE,
                UNIQUE(user_id, simulator_id)
            )`, (err) => {
                if (err) reject(err);
            });

            // 4. Content/News Table
            db.run(`CREATE TABLE IF NOT EXISTS content (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                body TEXT NOT NULL,
                category TEXT NOT NULL,
                author TEXT,
                type TEXT DEFAULT 'article' CHECK(type IN ('article', 'news', 'threat', 'event')),
                thumbnail TEXT,
                tags TEXT DEFAULT '[]',
                views INTEGER DEFAULT 0,
                likes INTEGER DEFAULT 0,
                is_urgent BOOLEAN DEFAULT 0,
                date_published DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'published' CHECK(status IN ('published', 'draft', 'archived'))
            )`, (err) => {
                if (err) reject(err);
            });

            // 5. Logs Table
            db.run(`CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                action TEXT NOT NULL,
                resource_type TEXT,
                resource_id INTEGER,
                details TEXT,
                ip_address TEXT,
                user_agent TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )`, (err) => {
                if (err) reject(err);
            });

            // 6. Badges Table
            db.run(`CREATE TABLE IF NOT EXISTS badges (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                icon TEXT,
                xp_threshold INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
                if (err) reject(err);
            });

            // 7. User Badges (Many-to-Many)
            db.run(`CREATE TABLE IF NOT EXISTS user_badges (
                user_id INTEGER NOT NULL,
                badge_id INTEGER NOT NULL,
                earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, badge_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
            )`, (err) => {
                if (err) reject(err);
            });

            console.log('All database tables initialized successfully');
            resolve();
        });
    });
}

// Seed data function
async function seedDatabase() {
    return new Promise(async (resolve, reject) => {
        try {
            // Seed default admin user
            const adminPassword = await bcrypt.hash('admin123', 10);
            db.run(
                `INSERT OR IGNORE INTO users (username, email, password_hash, role, total_xp) 
                 VALUES ('admin', 'admin@tu.edu.sa', ?, 'admin', 9999)`,
                [adminPassword]
            );

            // Seed simulators
            const simulators = [
                ['محاكي Bash الاحترافي', 'tool', 'beginner', 'os', 'تعلم أوامر Linux من الصفر حتى الاحتراف', 'Terminal', 32, 500],
                ['عملية الفهد الأسود', 'attack', 'intermediate', 'pentesting', 'سيناريو اختراق كامل مع 5 مراحل', 'Shield', 15, 800]
            ];

            simulators.forEach(sim => {
                db.run(
                    `INSERT OR IGNORE INTO simulators (title, type, difficulty, category, description, icon, lessons_count, xp_reward) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    sim
                );
            });

            // Seed content/news
            const contents = [
                ['اكتشاف ثغرة Zero-Day في أنظمة Linux', 'تم اكتشاف ثغرة أمنية خطيرة في نواة Linux تسمح بتنفيذ كود عن بُعد...', 'threats', 'System', 'news', null, '["Linux", "CVE", "Kernel"]', 1],
                ['تحديث جديد لأداة Wireshark يدعم بروتوكولات IoT', 'أصدر فريق Wireshark النسخة 4.2 مع دعم محسّن لبروتوكولات إنترنت الأشياء...', 'tools', 'Network Team', 'news', null, '["Wireshark", "IoT", "Network"]', 0],
                ['نادي الأمن السيبراني يطلق معسكر "الاختراق الأخلاقي"', 'سيقام المعسكر التدريبي الشهري في مقر النادي بتاريخ 15 فبراير...', 'events', 'TUCC Team', 'news', null, '["Event", "Training", "CTF"]', 0],
                ['مقدمة في الهندسة الاجتماعية', 'الهندسة الاجتماعية هي فن خداع الأشخاص للحصول على معلومات سرية...', 'psychology', 'د. فهد', 'article', null, '["Social Engineering", "Psychology"]', 0],
                ['شرح أوامر Bash الأساسية', 'دليل شامل لأهم أوامر Linux التي يحتاجها كل مختبر اختراق...', 'linux', 'أ. نورة', 'article', null, '["Linux", "Bash", "Terminal"]', 0]
            ];

            contents.forEach(content => {
                db.run(
                    `INSERT OR IGNORE INTO content (title, body, category, author, type, thumbnail, tags, is_urgent) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    content
                );
            });

            // Seed badges
            const badges = [
                ['المبتدئ', 'أكمل أول درس في المحاكي', 'Star', 100],
                ['محترف Bash', 'أكمل جميع دروس محاكي Bash', 'Terminal', 500],
                ['المهاجم', 'أكمل عملية الفهد الأسود', 'Shield', 800],
                ['المتعلم المجتهد', 'اكتسب 1000 نقطة XP', 'Award', 1000],
                ['خبير الأمن', 'أكمل جميع المحاكيات', 'Trophy', 2000]
            ];

            badges.forEach(badge => {
                db.run(
                    `INSERT OR IGNORE INTO badges (name, description, icon, xp_threshold) 
                     VALUES (?, ?, ?, ?)`,
                    badge
                );
            });

            console.log('Database seeded successfully');
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    db,
    initializeDatabase,
    seedDatabase
};
