const pool = require('../config/db');

const createClientUsersTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS client_users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            number VARCHAR(20) NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(query);
        console.log("Client Users table established");
    } catch (err) {
        console.error("Error creating client_users table", err);
    }
};

module.exports = { createClientUsersTable };
