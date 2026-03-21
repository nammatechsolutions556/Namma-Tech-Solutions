const pool = require('../config/db');

const createRequestsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS project_requests (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50) NOT NULL,
            project VARCHAR(255) NOT NULL,
            budget VARCHAR(100),
            requirements TEXT NOT NULL,
            status VARCHAR(50) DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(query);
        console.log("Project requests table established");
    } catch (err) {
        console.error("Error creating project requests table", err);
    }
};

module.exports = { createRequestsTable };
