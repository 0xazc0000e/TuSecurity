const { prisma } = require('../models/prismaDatabase');

const getAllNews = async (req, res) => {
    try {
        const { limit = 50, type } = req.query;

        const where = {};
        if (type) {
            where.type = type;
        }

        const news = await prisma.news.findMany({
            where,
            orderBy: {
                created_at: 'desc'
            },
            take: parseInt(limit)
        });

        res.json(news);
    } catch (err) {
        console.error('Get news error:', err);
        return res.status(500).json({ error: 'Failed to fetch news' });
    }
};

const getLatestUpdates = async (req, res) => {
    try {
        const [latestEvent, latestSurvey, latestNews] = await Promise.all([
            prisma.club_events.findFirst({
                select: { id: true, title: true, description: true, category: true, created_at: true },
                orderBy: { created_at: 'desc' }
            }),
            prisma.club_surveys.findFirst({
                select: { id: true, title: true, description: true, created_at: true },
                orderBy: { created_at: 'desc' }
            }),
            prisma.news.findFirst({
                select: { id: true, title: true, body: true, image_url: true, type: true, created_at: true },
                orderBy: { created_at: 'desc' }
            }),
        ]);

        const latestUpdates = [];

        if (latestEvent) {
            latestUpdates.push({
                ...latestEvent,
                type_tag: latestEvent.category,
                type: 'event'
            });
        }

        if (latestSurvey) {
            latestUpdates.push({
                ...latestSurvey,
                type_tag: 'استطلاع',
                type: 'survey'
            });
        }

        if (latestNews) {
            latestUpdates.push({
                id: latestNews.id,
                title: latestNews.title,
                description: latestNews.body,
                image: latestNews.image_url,
                type: 'news',
                created_at: latestNews.created_at
            });
        }

        res.json({ success: true, latest: latestUpdates });
    } catch (error) {
        console.error('Error fetching latest updates:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch latest club updates' });
    }
};

const getNewsById = async (req, res) => {
    try {
        const { id } = req.params;
        const row = await prisma.news.findUnique({
            where: { id: parseInt(id) }
        });

        if (!row) return res.status(404).json({ error: 'News not found' });
        res.json(row);
    } catch (err) {
        console.error('Get news by ID error:', err);
        res.status(500).json({ error: err.message });
    }
};

const createNews = async (req, res) => {
    try {
        const { title, body, tags, type } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;

        if (!title || !body) return res.status(400).json({ error: 'Title and Body are required' });

        const news = await prisma.news.create({
            data: {
                title,
                body,
                image_url,
                tags,
                type: type || 'news'
            }
        });

        res.status(201).json({ id: news.id, title, image_url });
    } catch (err) {
        console.error('Create news error:', err);
        res.status(500).json({ error: err.message });
    }
};

const updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, body, tags, type } = req.body;
        let image_url = req.body.image_url;

        if (req.file) {
            image_url = `/uploads/${req.file.filename}`;
        }

        const data = {
            title,
            body,
            tags,
            type: type || 'news'
        };

        if (image_url) {
            data.image_url = image_url;
        }

        const updatedNews = await prisma.news.update({
            where: { id: parseInt(id) },
            data
        });

        res.json({ message: 'News updated' });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'News not found' });
        }
        console.error('Update news error:', err);
        res.status(500).json({ error: err.message });
    }
};

const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.news.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'News deleted' });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'News not found' });
        }
        console.error('Delete news error:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllNews,
    getLatestUpdates,
    getNewsById,
    createNews,
    updateNews,
    deleteNews
};
