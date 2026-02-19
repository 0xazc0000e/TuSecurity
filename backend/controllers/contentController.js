const { db } = require('../models/database');

// Content Management

const getAllContent = (req, res) => {
    const { type, category } = req.query;
    let query = 'SELECT * FROM content';
    let params = [];

    if (type) {
        query += ' WHERE type = ?';
        params.push(type);
    }

    if (category) {
        query += type ? ' AND category = ?' : ' WHERE category = ?';
        params.push(category);
    }

    query += ' ORDER BY created_at DESC';

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Get content error:', err);
            return res.status(500).json({ error: 'Failed to fetch content' });
        }
        res.json(rows);
    });
};

const createContent = (req, res) => {
    console.log('Create Content Request Body:', req.body);
    console.log('Create Content File:', req.file);

    const { title, body, content: bodyAlt, type, category, image_url } = req.body;

    // Accept either 'body' or 'content' from frontend
    const bodyText = body || bodyAlt;

    // Construct Image URL
    // If a file is uploaded via multer, req.file will be populated.
    // If usage of image_url string is allowed (e.g. external link), we use that as fallback.
    const thumbUrl = req.file ? `/uploads/${req.file.filename}` : (image_url || null);

    if (!title || !bodyText) {
        return res.status(400).json({ error: 'Title and body are required' });
    }

    // Default to 'news' if type is missing
    const contentType = type || 'news';

    db.run(
        `INSERT INTO content (title, body, type, category, thumbnail, author, status) 
         VALUES (?, ?, ?, ?, ?, ?, 'published')`,
        [title, bodyText, contentType, category || 'general', thumbUrl, req.user?.username || 'Admin'],
        function (err) {
            if (err) {
                console.error('Create content error:', err);
                return res.status(500).json({ error: 'Failed to create content' });
            }

            const contentId = this.lastID;

            // Log the action
            db.run(
                `INSERT INTO logs (user_id, action, resource_type, resource_id, details, ip_address) 
                 VALUES (?, ?, 'content', ?, ?, ?)`,
                [req.user?.id || 0, 'CONTENT_CREATED', contentId, `Created ${contentType}: ${title}`, req.ip || 'unknown']
            );

            res.status(201).json({
                message: 'Content created successfully',
                id: contentId,
                thumbnail: thumbUrl,
                // Return matched fields for frontend convenience
                title,
                body: bodyText,
                type: contentType
            });
        }
    );
};

const updateContent = (req, res) => {
    const { id } = req.params;
    const { title, body, content: bodyAlt, category, image_url } = req.body;

    const bodyText = body || bodyAlt;
    // If a new file is uploaded, use it. Otherwise use the provided image_url (which might be the existing one)
    let thumbUrl = req.file ? `/uploads/${req.file.filename}` : (image_url || null);

    // Construct the SQL query dynamically based on whether thumbnail is being updated
    let query = `UPDATE content SET title = ?, body = ?, category = ?, date_published = CURRENT_TIMESTAMP`;
    let params = [title, bodyText, category || 'general'];

    if (thumbUrl) {
        query += `, thumbnail = ?`;
        params.push(thumbUrl);
    }

    query += ` WHERE id = ?`;
    params.push(id);

    db.run(
        query,
        params,
        function (err) {
            if (err) {
                console.error('Update content error:', err);
                return res.status(500).json({ error: 'Failed to update content' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Content not found' });
            }

            // Log the action
            db.run(
                `INSERT INTO logs (user_id, action, resource_type, resource_id, details, ip_address) 
                 VALUES (?, ?, 'content', ?, ?, ?)`,
                [req.user?.id || 0, 'CONTENT_UPDATED', id, `Updated: ${title}`, req.ip || 'unknown']
            );

            res.json({ message: 'Content updated successfully', thumbnail: thumbUrl });
        }
    );
};

const deleteContent = (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM content WHERE id = ?', [id], function (err) {
        if (err) {
            console.error('Delete content error:', err);
            return res.status(500).json({ error: 'Failed to delete content' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Content not found' });
        }

        // Log the action
        db.run(
            `INSERT INTO logs (user_id, action, resource_type, resource_id, details, ip_address) 
             VALUES (?, ?, 'content', ?, ?, ?)`,
            [req.user?.id || 0, 'CONTENT_DELETED', id, 'Content deleted', req.ip || 'unknown']
        );

        res.json({ message: 'Content deleted successfully' });
    });
};

// Simulator & Scenario Management

const getAllSimulators = (req, res) => {
    db.all('SELECT * FROM simulators ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            console.error('Get simulators error:', err);
            return res.status(500).json({ error: 'Failed to fetch simulators' });
        }
        res.json(rows);
    });
};

const createSimulator = (req, res) => {
    // Legacy support for simulator creating, though we are moving to scenarios.
    const { title, description, type, difficulty, category } = req.body;

    if (!title || !type || !difficulty) {
        return res.status(400).json({ error: 'Title, type, and difficulty are required' });
    }

    db.run(
        `INSERT INTO simulators (title, description, type, difficulty, category) 
         VALUES (?, ?, ?, ?, ?)`,
        [title, description || '', type, difficulty, category || 'general'],
        function (err) {
            if (err) {
                console.error('Create simulator error:', err);
                return res.status(500).json({ error: 'Failed to create simulator' });
            }

            const simulatorId = this.lastID;

            // Log the action
            db.run(
                `INSERT INTO logs (user_id, action, resource_type, resource_id, details, ip_address) 
                 VALUES (?, ?, 'simulator', ?, ?, ?)`,
                [req.user?.id || 0, 'SIMULATOR_CREATED', simulatorId, `Created: ${title}`, req.ip || 'unknown']
            );

            res.status(201).json({
                message: 'Simulator created successfully',
                id: simulatorId
            });
        }
    );
};

const updateSimulator = (req, res) => {
    const { id } = req.params;
    const { title, description, difficulty, category } = req.body;

    db.run(
        `UPDATE simulators 
         SET title = ?, description = ?, difficulty = ?, category = ? 
         WHERE id = ?`,
        [title, description, difficulty, category, id],
        function (err) {
            if (err) {
                console.error('Update simulator error:', err);
                return res.status(500).json({ error: 'Failed to update simulator' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Simulator not found' });
            }

            res.json({ message: 'Simulator updated successfully' });
        }
    );
};

const deleteSimulator = (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM simulators WHERE id = ?', [id], function (err) {
        if (err) {
            console.error('Delete simulator error:', err);
            return res.status(500).json({ error: 'Failed to delete simulator' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Simulator not found' });
        }

        res.json({ message: 'Simulator deleted successfully' });
    });
};

// --- Scenario Management ---

const getAllScenarios = (req, res) => {
    const { type } = req.query;
    let query = 'SELECT * FROM scenarios';
    let params = [];

    if (type) {
        query += ' WHERE simulator_type = ?';
        params.push(type);
    }

    query += ' ORDER BY created_at DESC';

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Get scenarios error:', err);
            return res.status(500).json({ error: 'Failed to fetch scenarios' });
        }
        res.json(rows);
    });
};

const createScenario = (req, res) => {
    const { simulator_type, title, description, objective, expected_answer, hints, xp_reward } = req.body;

    if (!simulator_type || !title || !objective || !expected_answer) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    db.run(
        `INSERT INTO scenarios (simulator_type, title, description, objective, expected_answer, hints, xp_reward)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [simulator_type, title, description || '', objective, expected_answer, JSON.stringify(hints || []), xp_reward || 10],
        function (err) {
            if (err) {
                console.error('Create scenario error:', err);
                return res.status(500).json({ error: 'Failed to create scenario' });
            }

            const scenarioId = this.lastID;

            // Log action
            db.run(
                `INSERT INTO logs (user_id, action, resource_type, resource_id, details, ip_address) 
                 VALUES (?, ?, 'scenario', ?, ?, ?)`,
                [req.user?.id || 0, 'SCENARIO_CREATED', scenarioId, `Created scenario: ${title}`, req.ip || 'unknown']
            );

            res.status(201).json({
                message: 'Scenario created successfully',
                id: scenarioId
            });
        }
    );
};

const updateScenario = (req, res) => {
    const { id } = req.params;
    const { simulator_type, title, description, objective, expected_answer, hints, xp_reward } = req.body;

    db.run(
        `UPDATE scenarios 
         SET simulator_type = ?, title = ?, description = ?, objective = ?, expected_answer = ?, hints = ?, xp_reward = ?
         WHERE id = ?`,
        [simulator_type, title, description, objective, expected_answer, JSON.stringify(hints || []), xp_reward, id],
        function (err) {
            if (err) {
                console.error('Update scenario error:', err);
                return res.status(500).json({ error: 'Failed to update scenario' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Scenario not found' });
            }

            res.json({ message: 'Scenario updated successfully' });
        }
    );
};

const deleteScenario = (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM scenarios WHERE id = ?', [id], function (err) {
        if (err) {
            console.error('Delete scenario error:', err);
            return res.status(500).json({ error: 'Failed to delete scenario' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Scenario not found' });
        }

        // Log action
        db.run(
            `INSERT INTO logs (user_id, action, resource_type, resource_id, details, ip_address) 
             VALUES (?, ?, 'scenario', ?, ?, ?)`,
            [req.user?.id || 0, 'SCENARIO_DELETED', id, 'Scenario deleted', req.ip || 'unknown']
        );

        res.json({ message: 'Scenario deleted successfully' });
    });
};

module.exports = {
    getAllContent,
    createContent,
    updateContent,
    deleteContent,
    getAllSimulators,
    createSimulator,
    updateSimulator,
    deleteSimulator,
    getAllScenarios,
    createScenario,
    updateScenario,
    deleteScenario
};
