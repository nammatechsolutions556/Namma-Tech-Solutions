const pool = require('../config/db');

const createContactMessagesTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS contact_messages (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            mobile VARCHAR(20),
            subject VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            status VARCHAR(50) DEFAULT 'Unread',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(query);
        console.log("Contact messages table established");
    } catch (err) {
        console.error("Error creating contact messages table", err);
    }
};

module.exports = { createContactMessagesTable };
