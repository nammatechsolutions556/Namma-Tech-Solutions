const pool = require('../config/db');

const createProjectsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS projects (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            price VARCHAR(100) NOT NULL,
            description TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    const alterQuery = `ALTER TABLE projects ADD COLUMN IF NOT EXISTS images TEXT[], ADD COLUMN IF NOT EXISTS video VARCHAR(255);`;

    try {
        await pool.query(query);
        await pool.query(alterQuery);
        console.log("Projects table established with media columns");
    } catch (err) {
        console.error("Error creating/altering projects table", err);
    }
};

module.exports = { createProjectsTable };
