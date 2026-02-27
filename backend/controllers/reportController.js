const { prisma } = require('../models/prismaDatabase');

/**
 * Submit a new report (Any authenticated user)
 */
const submitReport = async (req, res) => {
    try {
        const { subject, description } = req.body;
        const userId = req.user.id;

        if (!subject || !description) {
            return res.status(400).json({ error: 'Subject and description are required' });
        }

        const report = await prisma.reports.create({
            data: {
                user_id: userId,
                subject,
                description,
                status: 'PENDING'
            }
        });

        // Log the action
        await prisma.logs.create({
            data: {
                user_id: userId,
                action: 'REPORT_SUBMITTED',
                resource_type: 'report',
                resource_id: parseInt(report.id.split('-')[0]) || 0, // UUID to int hack for log schema if needed, or just 0
                details: `Report submitted: ${subject}`,
                ip_address: req.ip || 'unknown'
            }
        });

        res.status(201).json({
            message: 'Report submitted successfully',
            report
        });
    } catch (err) {
        console.error('Submit report error:', err);
        res.status(500).json({ error: 'Failed to submit report' });
    }
};

/**
 * Get all reports (Managers, Admins, Super Admins)
 */
const getAllReports = async (req, res) => {
    try {
        const reports = await prisma.reports.findMany({
            include: {
                users: {
                    select: {
                        username: true,
                        email: true,
                        full_name: true
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        });

        res.json(reports);
    } catch (err) {
        console.error('Get reports error:', err);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
};

/**
 * Update report status (Mark as RESOLVED)
 */
const updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['PENDING', 'RESOLVED'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Must be PENDING or RESOLVED' });
        }

        await prisma.reports.update({
            where: { id },
            data: { status }
        });

        // Log the action
        await prisma.logs.create({
            data: {
                user_id: req.user.id,
                action: 'REPORT_STATUS_UPDATED',
                resource_type: 'report',
                details: `Report ${id} status set to ${status}`,
                ip_address: req.ip || 'unknown'
            }
        });

        res.json({ message: 'Report status updated successfully' });
    } catch (err) {
        console.error('Update report error:', err);
        if (err.code === 'P2025') return res.status(404).json({ error: 'Report not found' });
        res.status(500).json({ error: 'Failed to update report status' });
    }
};

module.exports = {
    submitReport,
    getAllReports,
    updateReportStatus
};
