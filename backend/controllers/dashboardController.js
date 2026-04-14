const pool = require('../config/db');

// @route   GET /api/dashboard
// @desc    Get dashboard statistics and recent data
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
    try {
        const projectsCountResult = await pool.query('SELECT COUNT(*) FROM projects');
        const applicationsCountResult = await pool.query('SELECT COUNT(*) FROM internship_applications');
        const requestsCountResult = await pool.query('SELECT COUNT(*) FROM project_requests');
        const certificatesCountResult = await pool.query('SELECT COUNT(*) FROM certificates');
        const messagesCountResult = await pool.query('SELECT COUNT(*) FROM contact_messages');

        const recentRequestsResult = await pool.query('SELECT * FROM project_requests ORDER BY created_at DESC LIMIT 5');
        const recentMessagesResult = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5');

        // Fetch time-series data for analytics graph
        const reqStats = await pool.query(`
            SELECT TO_CHAR(created_at, 'Mon YYYY') as name, COUNT(*) as requests 
            FROM project_requests 
            GROUP BY TO_CHAR(created_at, 'Mon YYYY'), TO_CHAR(created_at, 'YYYY-MM')
            ORDER BY TO_CHAR(created_at, 'YYYY-MM') ASC
            LIMIT 6
        `);

        const appStats = await pool.query(`
            SELECT TO_CHAR(created_at, 'Mon YYYY') as name, COUNT(*) as applications 
            FROM internship_applications 
            GROUP BY TO_CHAR(created_at, 'Mon YYYY'), TO_CHAR(created_at, 'YYYY-MM')
            ORDER BY TO_CHAR(created_at, 'YYYY-MM') ASC
            LIMIT 6
        `);

        const allMonths = new Map();

        reqStats.rows.forEach(r => {
            allMonths.set(r.name, { name: r.name, requests: parseInt(r.requests), applications: 0 });
        });

        appStats.rows.forEach(a => {
            if (allMonths.has(a.name)) {
                allMonths.get(a.name).applications = parseInt(a.applications);
            } else {
                allMonths.set(a.name, { name: a.name, requests: 0, applications: parseInt(a.applications) });
            }
        });

        res.json({
            stats: {
                projects: parseInt(projectsCountResult.rows[0].count),
                applications: parseInt(applicationsCountResult.rows[0].count),
                requests: parseInt(requestsCountResult.rows[0].count),
                certificates: parseInt(certificatesCountResult.rows[0].count),
                messages: parseInt(messagesCountResult.rows[0].count),
            },
            recentRequests: recentRequestsResult.rows,
            recentMessages: recentMessagesResult.rows,
            graphData: Array.from(allMonths.values())
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
