const pool = require('../config/db');

const createInternshipsTable = async () => {
    // The 'durations' column will store a JSON array of { duration: string, price: string } objects
    const query = `
        CREATE TABLE IF NOT EXISTS internships (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            durations JSONB NOT NULL DEFAULT '[]'::jsonb,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(query);
        console.log("Internships table established");
    } catch (err) {
        console.error("Error creating internships table", err);
    }
};

module.exports = { createInternshipsTable };
