const { db } = require('../models/database');

const getAllNews = (req, res) => {
    const { limit = 50, type } = req.query;
    let query = 'SELECT * FROM news';
    let params = [];

    if (type) {
        query += ' WHERE type = ?';
        params.push(type);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Get news error:', err);
            return res.status(500).json({ error: 'Failed to fetch news' });
        }
        res.json(rows);
    });
};

const getLatestUpdates = async (req, res) => {
    const safeGet = (sql, params = []) => new Promise((resolve) => {
        db.get(sql, params, (err, row) => {
            if (err) { console.error('[getLatestUpdates] SQL error:', err.message); resolve(null); }
            else resolve(row || null);
        });
    });

    try {
        const [latestEvent, latestSurvey, latestNews] = await Promise.all([
            safeGet('SELECT id, title, description, category as type_tag, "event" as type, created_at FROM club_events ORDER BY created_at DESC LIMIT 1'),
            safeGet('SELECT id, title, description, type as type_tag, "survey" as type, created_at FROM club_surveys ORDER BY created_at DESC LIMIT 1'),
            safeGet('SELECT id, title, body as description, image_url as image, "news" as type, created_at FROM news ORDER BY created_at DESC LIMIT 1'),
        ]);

        const latestUpdates = [latestEvent, latestSurvey, latestNews].filter(Boolean);
        res.json({ success: true, latest: latestUpdates });
    } catch (error) {
        console.error('Error fetching latest updates:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch latest club updates' });
    }
};

const getNewsById = (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM news WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'News not found' });
        res.json(row);
    });
};

const createNews = (req, res) => {
    const { title, body, tags, type } = req.body;

    // Check if file uploaded via multer
    const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;

    if (!title || !body) return res.status(400).json({ error: 'Title and Body are required' });

    db.run(
        'INSERT INTO news (title, body, image_url, tags, type) VALUES (?, ?, ?, ?, ?)',
        [title, body, image_url, tags, type || 'news'],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, title, image_url });
        }
    );
};

const updateNews = (req, res) => {
    const { id } = req.params;
    const { title, body, tags, type } = req.body;
    let image_url = req.body.image_url;

    // If new file uploaded, use it
    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }

    let query = 'UPDATE news SET title = ?, body = ?, tags = ?, type = ?';
    let params = [title, body, tags, type || 'news'];

    if (image_url) {
        query += ', image_url = ?';
        params.push(image_url);
    }

    query += ' WHERE id = ?';
    params.push(id);

    db.run(query, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'News not found' });
        res.json({ message: 'News updated' });
    });
};

const deleteNews = (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM news WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'News not found' });
        res.json({ message: 'News deleted' });
    });
};

module.exports = {
    getAllNews,
    getLatestUpdates,
    getNewsById,
    createNews,
    updateNews,
    deleteNews
};
