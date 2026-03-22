const pool = require('../config/db');

const createPortfolioProjectsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS portfolio_projects (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            price VARCHAR(100),
            images TEXT[],
            videos TEXT[],
            completed_date DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(query);
        console.log("Portfolio projects table established");
    } catch (err) {
        console.error("Error creating portfolio projects table", err);
    }
};

module.exports = { createPortfolioProjectsTable };
