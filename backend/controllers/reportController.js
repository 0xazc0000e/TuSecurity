const { 
    getDashboardStats, 
    getUserActivityReport, 
    getTopUsers, 
    getContentPerformanceReport, 
    getEngagementMetrics,
    getSystemHealthReport 
} = require('../services/reportService');

// Get main dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
        const stats = await getDashboardStats();
        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Error in getDashboardStats:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch dashboard stats' });
    }
};

// Get user activity report
exports.getUserActivityReport = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const report = await getUserActivityReport(days);
        res.json({
            success: true,
            report
        });
    } catch (error) {
        console.error('Error in getUserActivityReport:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch activity report' });
    }
};

// Get top users leaderboard
exports.getTopUsers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const users = await getTopUsers(limit);
        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Error in getTopUsers:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch top users' });
    }
};

// Get content performance report
exports.getContentPerformanceReport = async (req, res) => {
    try {
        const report = await getContentPerformanceReport();
        res.json({
            success: true,
            report
        });
    } catch (error) {
        console.error('Error in getContentPerformanceReport:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch content performance' });
    }
};

// Get engagement metrics
exports.getEngagementMetrics = async (req, res) => {
    try {
        const metrics = await getEngagementMetrics();
        res.json({
            success: true,
            metrics
        });
    } catch (error) {
        console.error('Error in getEngagementMetrics:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch engagement metrics' });
    }
};

// Get system health report
exports.getSystemHealthReport = async (req, res) => {
    try {
        const report = await getSystemHealthReport();
        res.json({
            success: true,
            report
        });
    } catch (error) {
        console.error('Error in getSystemHealthReport:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch system health' });
    }
};

// Get comprehensive report (all in one)
exports.getFullReport = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        
        const [
            dashboardStats,
            activityReport,
            topUsers,
            contentPerformance,
            engagementMetrics,
            systemHealth
        ] = await Promise.all([
            getDashboardStats(),
            getUserActivityReport(days),
            getTopUsers(10),
            getContentPerformanceReport(),
            getEngagementMetrics(),
            getSystemHealthReport()
        ]);

        res.json({
            success: true,
            report: {
                dashboard: dashboardStats,
                activity: activityReport,
                topUsers,
                content: contentPerformance,
                engagement: engagementMetrics,
                systemHealth,
                generatedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error in getFullReport:', error);
        res.status(500).json({ success: false, error: 'Failed to generate full report' });
    }
};

// Export report as CSV (placeholder for future implementation)
exports.exportReport = async (req, res) => {
    try {
        const { type } = req.params;
        
        // For now, return JSON with export notice
        // In production, this would generate a CSV/PDF file
        res.json({
            success: true,
            message: `Export for ${type} will be implemented with CSV/PDF generation`,
            note: 'Use the regular endpoints to get data and export client-side'
        });
    } catch (error) {
        console.error('Error in exportReport:', error);
        res.status(500).json({ success: false, error: 'Failed to export report' });
    }
};
