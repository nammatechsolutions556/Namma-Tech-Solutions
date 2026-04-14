const pool = require('../config/db');

const runMigrations = async () => {
    console.log("Starting database optimizations (Indexing)...");
    
    const indexQueries = [
        // Projects indexing
        "CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC)",
        "CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category)",
        
        // Internship indexing
        "CREATE INDEX IF NOT EXISTS idx_internships_created_at ON internships(created_at DESC)",
        
        // Portfolio indexing
        "CREATE INDEX IF NOT EXISTS idx_portfolio_created_at ON portfolio_projects(created_at DESC)",
        "CREATE INDEX IF NOT EXISTS idx_portfolio_date ON portfolio_projects(completed_date DESC)",
        
        // Requests & Applications indexing (Critical for Admin)
        "CREATE INDEX IF NOT EXISTS idx_project_requests_created_at ON project_requests(created_at DESC)",
        "CREATE INDEX IF NOT EXISTS idx_intern_apps_created_at ON internship_applications(created_at DESC)",
        
        // Certificate indexing (Critical for public verification)
        "CREATE INDEX IF NOT EXISTS idx_certificates_ref ON certificates(reference_number)",
        "CREATE INDEX IF NOT EXISTS idx_certificates_created_at ON certificates(created_at DESC)",
        
        // Contact messages
        "CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC)"
    ];

    try {
        for (const query of indexQueries) {
            await pool.query(query);
            console.log(`Executed: ${query.substring(0, 50)}...`);
        }
        console.log("Database optimizations completed successfully.");
    } catch (err) {
        console.error("Migration Error:", err);
    } finally {
        process.exit();
    }
};

runMigrations();
