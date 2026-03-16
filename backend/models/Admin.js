const pool = require('../config/db');

const createAdminTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS admins (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(query);
        console.log("Admin table established");
    } catch (err) {
        console.error("Error creating admins table", err);
    }
};

module.exports = { createAdminTable };
