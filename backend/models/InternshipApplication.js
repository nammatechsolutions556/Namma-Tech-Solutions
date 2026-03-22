const pool = require('../config/db');

const createInternshipApplicationsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS internship_applications (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50) NOT NULL,
            domain VARCHAR(255) NOT NULL,
            duration VARCHAR(50) NOT NULL,
            price VARCHAR(50) NOT NULL,
            college VARCHAR(255) NOT NULL,
            course VARCHAR(255) NOT NULL,
            interest TEXT,
            resume_url VARCHAR(500),
            status VARCHAR(50) DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(query);
        console.log("Internship applications table established");
    } catch (err) {
        console.error("Error creating internship applications table", err);
    }
};

module.exports = { createInternshipApplicationsTable };
