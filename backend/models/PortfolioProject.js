const pool = require('../config/db');

const createPortfolioProjectsTable = async () => {
        CREATE TABLE IF NOT EXISTS portfolio_projects (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            price VARCHAR(100),
            video VARCHAR(255),
            completed_date DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const alterQuery = `ALTER TABLE portfolio_projects DROP COLUMN IF EXISTS images, DROP COLUMN IF EXISTS videos, ADD COLUMN IF NOT EXISTS video VARCHAR(255);`;

    try {
        await pool.query(query);
        await pool.query(alterQuery);
        console.log("Portfolio projects table established");
    } catch (err) {
        console.error("Error creating portfolio projects table", err);
    }
};

module.exports = { createPortfolioProjectsTable };
