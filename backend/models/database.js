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
            // --- USERS & CORE ---
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT DEFAULT 'student' CHECK(role IN ('admin', 'editor', 'student')),
                university_id TEXT,
                major TEXT,
                bio TEXT,
                skill_level TEXT,
                interests TEXT,
                avatar TEXT DEFAULT '/default-avatar.png',
                total_xp INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_active DATETIME,
                status TEXT DEFAULT 'active' CHECK(status IN ('active', 'suspended', 'inactive'))
            )`);

            // --- SIMULATORS ---
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
            )`);

            // --- SCENARIOS ---
            db.run(`CREATE TABLE IF NOT EXISTS scenarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                simulator_type TEXT NOT NULL CHECK(simulator_type IN ('bash', 'attack')),
                title TEXT NOT NULL,
                description TEXT,
                objective TEXT NOT NULL,
                expected_answer TEXT NOT NULL,
                hints TEXT DEFAULT '[]',
                xp_reward INTEGER DEFAULT 10,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // --- LMS 4-LEVEL HIERARCHY ---
            // Removed DROP TABLE statements to preserve data

            // 1. Tracks (Top Level)
            db.run(`CREATE TABLE IF NOT EXISTS tracks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                icon TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // 2. Courses (Belong to Tracks)
            db.run(`CREATE TABLE IF NOT EXISTS courses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                track_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                sort_order INTEGER DEFAULT 0,
                FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE
            )`);

            // 3. Units (Belong to Courses)
            db.run(`CREATE TABLE IF NOT EXISTS units (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                course_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                sort_order INTEGER DEFAULT 0,
                FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
            )`);

            // 4. Lessons (Belong to Units)
            db.run(`CREATE TABLE IF NOT EXISTS lessons (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                unit_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                content TEXT,                 -- Markdown content with component tags
                quiz_config TEXT,             -- JSON config for quizzes
                terminal_config TEXT,         -- JSON config for terminal scenarios
                next_lesson_id INTEGER,       -- ID of the next lesson (manual override)
                xp_reward INTEGER DEFAULT 10,
                video_url TEXT,
                is_interactive BOOLEAN DEFAULT 0,
                sort_order INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
            )`);

            // --- RECORDED COURSES ---
            db.run(`CREATE TABLE IF NOT EXISTS recorded_courses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                instructor TEXT,
                thumbnail_url TEXT,
                video_url TEXT NOT NULL,
                duration TEXT,
                tags TEXT DEFAULT '[]',
                sort_order INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // --- ARTICLES ---
            db.run(`CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT,
                description TEXT,
                author TEXT,
                cover_image TEXT,
                tags TEXT DEFAULT '[]',
                read_time INTEGER DEFAULT 5,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // --- KB TAGS ---
            db.run(`CREATE TABLE IF NOT EXISTS kb_tags (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                color TEXT DEFAULT '#7112AF',
                type TEXT DEFAULT 'general'
            )`);

            // --- NEWS ---
            db.run(`CREATE TABLE IF NOT EXISTS news (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                body TEXT NOT NULL,
                image_url TEXT,
                tags TEXT,
                type TEXT DEFAULT 'news',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // --- USER ENROLLMENTS (Tracks/Courses) ---
            db.run(`CREATE TABLE IF NOT EXISTS user_enrollments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                type TEXT NOT NULL CHECK(type IN ('track', 'course')),
                item_id INTEGER NOT NULL,
                progress INTEGER DEFAULT 0,
                is_completed BOOLEAN DEFAULT 0,
                enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE(user_id, type, item_id)
            )`);

            // --- USER LESSON COMPLETION ---
            db.run(`CREATE TABLE IF NOT EXISTS user_lesson_completion (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                lesson_id INTEGER NOT NULL,
                completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE(user_id, lesson_id)
            )`);

            // --- USER LIKES ---
            db.run(`CREATE TABLE IF NOT EXISTS user_likes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                item_type TEXT NOT NULL, -- 'article', 'news', 'lesson'
                item_id INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE(user_id, item_type, item_id)
            )`);

            // --- USER BOOKMARKS ---
            db.run(`CREATE TABLE IF NOT EXISTS user_bookmarks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                item_type TEXT NOT NULL, -- 'article', 'news', 'lesson', 'course'
                item_id INTEGER NOT NULL,
                note TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE(user_id, item_type, item_id)
            )`);

            // --- USER PROGRESS ---
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
            )`);

            // --- LOGS ---
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
            )`);

            // --- USER BADGES ---
            db.run(`CREATE TABLE IF NOT EXISTS user_badges (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                badge_id INTEGER,
                badge_name TEXT,
                earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )`);

            // --- CLUB EVENTS ---
            db.run(`CREATE TABLE IF NOT EXISTS club_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                type TEXT DEFAULT 'workshop',
                category TEXT DEFAULT 'training',
                date TEXT,
                time TEXT,
                location TEXT,
                description TEXT,
                max_participants INTEGER DEFAULT 50,
                registered INTEGER DEFAULT 0,
                status TEXT DEFAULT 'open',
                xp_reward INTEGER DEFAULT 100,
                badges TEXT DEFAULT '[]',
                organizer TEXT,
                requirements TEXT DEFAULT '[]',
                agenda TEXT DEFAULT '[]',
                instructor TEXT,
                speaker TEXT,
                prerequisites TEXT DEFAULT '[]',
                materials TEXT DEFAULT '[]',
                difficulty TEXT,
                categories TEXT DEFAULT '[]',
                prizes TEXT DEFAULT '[]',
                topics TEXT DEFAULT '[]',
                activities TEXT DEFAULT '[]',
                link TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // --- CLUB SURVEYS ---
            db.run(`CREATE TABLE IF NOT EXISTS club_surveys (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                end_date TEXT,
                participants INTEGER DEFAULT 0,
                status TEXT DEFAULT 'active',
                questions INTEGER DEFAULT 0,
                xp_reward INTEGER DEFAULT 10,
                rating REAL DEFAULT 0,
                options TEXT DEFAULT '[]',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // --- CLUB ANNOUNCEMENTS ---
            db.run(`CREATE TABLE IF NOT EXISTS club_announcements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT,
                date TEXT,
                priority TEXT DEFAULT 'normal',
                type TEXT DEFAULT 'info',
                link TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // --- EVENT REGISTRATIONS ---
            db.run(`CREATE TABLE IF NOT EXISTS event_registrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                email TEXT,
                phone TEXT,
                student_id TEXT,
                experience TEXT,
                registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (event_id) REFERENCES club_events(id) ON DELETE CASCADE
            )`);

            console.log('Database tables initialized (4-Level LMS Hierarchy + Events Active)');
            // --- DISTINGUISHED MEMBERS ---
            db.run(`CREATE TABLE IF NOT EXISTS distinguished_members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                committee TEXT,
                month TEXT NOT NULL,
                reason TEXT,
                color TEXT DEFAULT '#f59e0b',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // --- ANONYMOUS MESSAGES ---
            db.run(`CREATE TABLE IF NOT EXISTS anonymous_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                member_id INTEGER NOT NULL,
                message TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (member_id) REFERENCES distinguished_members(id)
            )`);

            // Migration: add color column if missing
            db.run(`ALTER TABLE distinguished_members ADD COLUMN color TEXT DEFAULT '#f59e0b'`, () => { });

            // Migration: add link column to club_events if missing
            db.run(`ALTER TABLE club_events ADD COLUMN link TEXT`, () => { });

            // Migration: add image column to club_events if missing
            db.run(`ALTER TABLE club_events ADD COLUMN image TEXT`, () => { });

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

            // Seed 10 default users
            const defaultUserPassword = await bcrypt.hash('password123', 10);
            for (let i = 1; i <= 10; i++) {
                db.run(
                    `INSERT OR IGNORE INTO users (username, email, password_hash, role, total_xp) 
                     VALUES (?, ?, ?, 'student', 0)`,
                    [`user${i}`, `user${i}@tu.edu.sa`, defaultUserPassword]
                );
            }
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
