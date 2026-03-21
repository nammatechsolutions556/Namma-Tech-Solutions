const pool = require('../config/db');

const createCertificatesTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS certificates (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            internship VARCHAR(255) NOT NULL,
            certificate_url VARCHAR(500) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(query);
        // Add new columns if they do not exist
        await pool.query(`
            ALTER TABLE certificates 
            ADD COLUMN IF NOT EXISTS university VARCHAR(255),
            ADD COLUMN IF NOT EXISTS domain VARCHAR(255),
            ADD COLUMN IF NOT EXISTS start_date DATE,
            ADD COLUMN IF NOT EXISTS end_date DATE,
            ADD COLUMN IF NOT EXISTS gained_skills TEXT,
            ADD COLUMN IF NOT EXISTS reference_number VARCHAR(100),
            ADD COLUMN IF NOT EXISTS company_name VARCHAR(255) DEFAULT 'Namma Tech Solutions',
            ADD COLUMN IF NOT EXISTS cert_type VARCHAR(50),
            ADD COLUMN IF NOT EXISTS project_title VARCHAR(255),
            ADD COLUMN IF NOT EXISTS is_sent BOOLEAN DEFAULT FALSE;
        `);
        console.log("Certificates table established with all columns");
    } catch (err) {
        console.error("Error creating/altering certificates table", err);
    }
};

module.exports = { createCertificatesTable };
