const { prisma } = require('../models/prismaDatabase');

// Content Management

const getAllContent = async (req, res) => {
    try {
        const { type, category } = req.query;
        const where = {};
        if (type) where.type = type;
        if (category) where.category = category;

        const rows = await prisma.content.findMany({
            where,
            orderBy: { created_at: 'desc' }
        });
        res.json(rows);
    } catch (err) {
        console.error('Get content error:', err);
        res.status(500).json({ error: 'Failed to fetch content' });
    }
};

const getContentById = async (req, res) => {
    try {
        const { id } = req.params;
        const row = await prisma.content.findUnique({
            where: { id: parseInt(id) }
        });
        if (!row) return res.status(404).json({ error: 'Content not found' });
        res.json(row);
    } catch (err) {
        console.error('Get content by ID error:', err);
        res.status(500).json({ error: 'Failed to fetch content' });
    }
};

const createContent = async (req, res) => {
    try {
        const { title, body, content: bodyAlt, type, category, image_url } = req.body;
        const bodyText = body || bodyAlt;
        const thumbUrl = req.file ? `/uploads/${req.file.filename}` : (image_url || null);

        if (!title || !bodyText) {
            return res.status(400).json({ error: 'Title and body are required' });
        }

        const contentType = type || 'news';
        const content = await prisma.content.create({
            data: {
                title,
                body: bodyText,
                type: contentType,
                category: category || 'general',
                thumbnail: thumbUrl,
                author: req.user?.username || 'Admin',
                status: 'published'
            }
        });

        await prisma.logs.create({
            data: {
                user_id: req.user?.id || 0,
                action: 'CONTENT_CREATED',
                resource_type: 'content',
                resource_id: content.id,
                details: `Created ${contentType}: ${title}`,
                ip_address: req.ip || 'unknown'
            }
        });

        res.status(201).json({
            message: 'Content created successfully',
            id: content.id,
            thumbnail: thumbUrl,
            title,
            body: bodyText,
            type: contentType
        });
    } catch (err) {
        console.error('Create content error:', err);
        res.status(500).json({ error: 'Failed to create content' });
    }
};

const updateContent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, body, content: bodyAlt, category, image_url, status } = req.body;
        const bodyText = body || bodyAlt;
        let thumbUrl = req.file ? `/uploads/${req.file.filename}` : (image_url || null);

        const data = {
            title,
            body: bodyText,
            category: category || 'general',
            date_published: new Date(),
            status: status || 'published'
        };
        if (thumbUrl) data.thumbnail = thumbUrl;

        await prisma.content.update({
            where: { id: parseInt(id) },
            data
        });

        await prisma.logs.create({
            data: {
                user_id: req.user?.id || 0,
                action: 'CONTENT_UPDATED',
                resource_type: 'content',
                resource_id: parseInt(id),
                details: `Updated: ${title}`,
                ip_address: req.ip || 'unknown'
            }
        });

        res.json({ message: 'Content updated successfully', id: parseInt(id) });
    } catch (err) {
        console.error('Update content error:', err);
        if (err.code === 'P2025') return res.status(404).json({ error: 'Content not found' });
        res.status(500).json({ error: 'Failed to update content' });
    }
};

const deleteContent = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.content.delete({
            where: { id: parseInt(id) }
        });

        await prisma.logs.create({
            data: {
                user_id: req.user?.id || 0,
                action: 'CONTENT_DELETED',
                resource_type: 'content',
                resource_id: parseInt(id),
                details: 'Content deleted',
                ip_address: req.ip || 'unknown'
            }
        });

        res.json({ message: 'Content deleted successfully' });
    } catch (err) {
        console.error('Delete content error:', err);
        if (err.code === 'P2025') return res.status(404).json({ error: 'Content not found' });
        res.status(500).json({ error: 'Failed to delete content' });
    }
};

// Simulator & Scenario Management

const getAllSimulators = async (req, res) => {
    try {
        const rows = await prisma.simulators.findMany({
            orderBy: { created_at: 'desc' }
        });
        res.json(rows);
    } catch (err) {
        console.error('Get simulators error:', err);
        res.status(500).json({ error: 'Failed to fetch simulators' });
    }
};

const createSimulator = async (req, res) => {
    try {
        const { title, description, type, difficulty, category, icon, xp_reward, lessons_count } = req.body;
        if (!title || !type || !difficulty) {
            return res.status(400).json({ error: 'Title, type, and difficulty are required' });
        }

        const simulator = await prisma.simulators.create({
            data: {
                title,
                description: description || '',
                type,
                difficulty,
                category: category || 'general',
                icon: icon || 'Terminal',
                xp_reward: parseInt(xp_reward) || 0,
                lessons_count: parseInt(lessons_count) || 0,
                status: 'active'
            }
        });

        await prisma.logs.create({
            data: {
                user_id: req.user?.id || 0,
                action: 'SIMULATOR_CREATED',
                resource_type: 'simulator',
                resource_id: simulator.id,
                details: `Created: ${title}`,
                ip_address: req.ip || 'unknown'
            }
        });

        res.status(201).json({ message: 'Simulator created successfully', id: simulator.id });
    } catch (err) {
        console.error('Create simulator error:', err);
        res.status(500).json({ error: 'Failed to create simulator' });
    }
};

const updateSimulator = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, difficulty, category, icon, status, xp_reward, lessons_count } = req.body;

        await prisma.simulators.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                difficulty,
                category,
                icon,
                status,
                xp_reward: xp_reward !== undefined ? parseInt(xp_reward) : undefined,
                lessons_count: lessons_count !== undefined ? parseInt(lessons_count) : undefined
            }
        });

        res.json({ message: 'Simulator updated successfully' });
    } catch (err) {
        console.error('Update simulator error:', err);
        if (err.code === 'P2025') return res.status(404).json({ error: 'Simulator not found' });
        res.status(500).json({ error: 'Failed to update simulator' });
    }
};

const deleteSimulator = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.simulators.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Simulator deleted successfully' });
    } catch (err) {
        console.error('Delete simulator error:', err);
        if (err.code === 'P2025') return res.status(404).json({ error: 'Simulator not found' });
        res.status(500).json({ error: 'Failed to delete simulator' });
    }
};

// --- Scenario Management ---

const getAllScenarios = async (req, res) => {
    try {
        const { type } = req.query;
        const where = {};
        if (type) where.simulator_type = type;

        const rows = await prisma.scenarios.findMany({
            where,
            orderBy: { created_at: 'desc' }
        });
        res.json(rows);
    } catch (err) {
        console.error('Get scenarios error:', err);
        res.status(500).json({ error: 'Failed to fetch scenarios' });
    }
};

const createScenario = async (req, res) => {
    try {
        const { simulator_type, title, description, objective, expected_answer, hints, xp_reward } = req.body;
        if (!simulator_type || !title || !objective || !expected_answer) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const scenario = await prisma.scenarios.create({
            data: {
                simulator_type,
                title,
                description: description || '',
                objective,
                expected_answer,
                hints: typeof hints === 'string' ? hints : JSON.stringify(hints || []),
                xp_reward: parseInt(xp_reward) || 10
            }
        });

        await prisma.logs.create({
            data: {
                user_id: req.user?.id || 0,
                action: 'SCENARIO_CREATED',
                resource_type: 'scenario',
                resource_id: scenario.id,
                details: `Created scenario: ${title}`,
                ip_address: req.ip || 'unknown'
            }
        });

        res.status(201).json({ message: 'Scenario created successfully', id: scenario.id });
    } catch (err) {
        console.error('Create scenario error:', err);
        res.status(500).json({ error: 'Failed to create scenario' });
    }
};

const updateScenario = async (req, res) => {
    try {
        const { id } = req.params;
        const { simulator_type, title, description, objective, expected_answer, hints, xp_reward } = req.body;

        await prisma.scenarios.update({
            where: { id: parseInt(id) },
            data: {
                simulator_type,
                title,
                description,
                objective,
                expected_answer,
                hints: typeof hints === 'string' ? hints : JSON.stringify(hints || []),
                xp_reward: parseInt(xp_reward)
            }
        });

        res.json({ message: 'Scenario updated successfully' });
    } catch (err) {
        console.error('Update scenario error:', err);
        if (err.code === 'P2025') return res.status(404).json({ error: 'Scenario not found' });
        res.status(500).json({ error: 'Failed to update scenario' });
    }
};

const deleteScenario = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.scenarios.delete({
            where: { id: parseInt(id) }
        });

        await prisma.logs.create({
            data: {
                user_id: req.user?.id || 0,
                action: 'SCENARIO_DELETED',
                resource_type: 'scenario',
                resource_id: parseInt(id),
                details: 'Scenario deleted',
                ip_address: req.ip || 'unknown'
            }
        });

        res.json({ message: 'Scenario deleted successfully' });
    } catch (err) {
        console.error('Delete scenario error:', err);
        if (err.code === 'P2025') return res.status(404).json({ error: 'Scenario not found' });
        res.status(500).json({ error: 'Failed to delete scenario' });
    }
};

module.exports = {
    getAllContent,
    getContentById,
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
