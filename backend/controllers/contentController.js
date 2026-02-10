const { db } = require('../models/database');

// Get all content (news, articles, etc.)
exports.getAllContent = (req, res) => {
    const { type, category, limit = 20, page = 1 } = req.query;
    
    let query = `
        SELECT id, title, body, category, author, type, thumbnail, tags, 
               views, likes, is_urgent, date_published, status
        FROM content 
        WHERE status = 'published'
    `;
    const params = [];

    if (type) {
        query += ' AND type = ?';
        params.push(type);
    }

    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }

    query += ' ORDER BY date_published DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Get content error:', err);
            return res.status(500).json({ error: 'Failed to fetch content' });
        }

        // Parse tags from JSON string
        const content = rows.map(item => ({
            ...item,
            tags: JSON.parse(item.tags || '[]')
        }));

        res.json(content);
    });
};

// Get single content by ID
exports.getContentById = (req, res) => {
    const { id } = req.params;

    db.get(
        `SELECT id, title, body, category, author, type, thumbnail, tags, 
                views, likes, is_urgent, date_published
         FROM content 
         WHERE id = ? AND status = 'published'`,
        [id],
        (err, row) => {
            if (err) {
                console.error('Get content error:', err);
                return res.status(500).json({ error: 'Failed to fetch content' });
            }

            if (!row) {
                return res.status(404).json({ error: 'Content not found' });
            }

            // Increment views
            db.run('UPDATE content SET views = views + 1 WHERE id = ?', [id]);

            res.json({
                ...row,
                tags: JSON.parse(row.tags || '[]')
            });
        }
    );
};

// Create new content (admin only)
exports.createContent = (req, res) => {
    const { title, body, category, author, type = 'article', thumbnail, tags, is_urgent = false } = req.body;

    if (!title || !body || !category) {
        return res.status(400).json({ error: 'Title, body, and category are required' });
    }

    const tagsJson = JSON.stringify(tags || []);

    db.run(
        `INSERT INTO content (title, body, category, author, type, thumbnail, tags, is_urgent, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published')`,
        [title, body, category, author, type, thumbnail, tagsJson, is_urgent],
        function(err) {
            if (err) {
                console.error('Create content error:', err);
                return res.status(500).json({ error: 'Failed to create content' });
            }

            res.status(201).json({
                message: 'Content created successfully',
                id: this.lastID
            });
        }
    );
};

// Update content (admin only)
exports.updateContent = (req, res) => {
    const { id } = req.params;
    const { title, body, category, author, thumbnail, tags, is_urgent, status } = req.body;

    const tagsJson = JSON.stringify(tags || []);

    db.run(
        `UPDATE content 
         SET title = ?, body = ?, category = ?, author = ?, thumbnail = ?, 
             tags = ?, is_urgent = ?, status = ?, date_published = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [title, body, category, author, thumbnail, tagsJson, is_urgent, status, id],
        function(err) {
            if (err) {
                console.error('Update content error:', err);
                return res.status(500).json({ error: 'Failed to update content' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Content not found' });
            }

            res.json({ message: 'Content updated successfully' });
        }
    );
};

// Delete content (admin only)
exports.deleteContent = (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM content WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Delete content error:', err);
            return res.status(500).json({ error: 'Failed to delete content' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Content not found' });
        }

        res.json({ message: 'Content deleted successfully' });
    });
};

// Like content
exports.likeContent = (req, res) => {
    const { id } = req.params;

    db.run('UPDATE content SET likes = likes + 1 WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Like content error:', err);
            return res.status(500).json({ error: 'Failed to like content' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Content not found' });
        }

        res.json({ message: 'Content liked successfully' });
    });
};
