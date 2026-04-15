const pool = require("../config/db");

// Database health check
const testDBConnection = async (req, res) => {
    try {
        console.log("[DEBUG] Testing DB connection...");
        const result = await pool.query("SELECT NOW()");
        res.json({ message: "DB Connectivity OK", time: result.rows[0].now });
    } catch (err) {
        console.error("[ERROR] DB health check failed:", err);
        res.status(500).json({ message: "DB Connectivity Failed", error: err.message });
    }
};

// Get all projects
const getProjects = async (req, res) => {
    try {
        const result = await pool.query("SELECT id AS _id, title, category, price, description, images, video FROM projects ORDER BY created_at DESC");
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching projects" });
    }
};

// Create a new project
const createProject = async (req, res) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [DEBUG] createProject starting...`);
    console.log(`[${timestamp}] [DEBUG] Body keys:`, Object.keys(req.body));
    console.log(`[${timestamp}] [DEBUG] Files:`, req.files ? Object.keys(req.files) : "None");

    const { title, category, description, price } = req.body;
    try {
        let imageUrls = [];
        let videoUrl = null;

        if (req.files) {
            if (req.files.images) {
                console.log(`[${timestamp}] [DEBUG] Processing ${req.files.images.length} images...`);
                imageUrls = req.files.images.map(file => `/public/uploads/${file.filename}`);
            }
            if (req.files.video && req.files.video.length > 0) {
                console.log(`[${timestamp}] [DEBUG] Processing video...`);
                videoUrl = `/public/uploads/${req.files.video[0].filename}`;
            }
        }

        console.log(`[${timestamp}] [DEBUG] File processing complete. Starting database INSERT query...`);
        // Start a timer for the query
        const startQuery = Date.now();
        
        const result = await pool.query(
            "INSERT INTO projects (title, category, description, price, images, video) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id AS _id, title, category, price, description, images, video",
            [title || "", category || "", description || "", price || "", imageUrls, videoUrl]
        );

        const duration = Date.now() - startQuery;
        console.log(`[${timestamp}] [DEBUG] Database INSERT successful in ${duration}ms`);
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(`[${timestamp}] [ERROR] createProject failed:`, err);
        res.status(500).json({ message: "Server error creating project", error: err.message });
    }
};

// Update a project
const updateProject = async (req, res) => {
    const { id } = req.params;
    console.log(`[DEBUG] updateProject reached for ID: ${id}. Body:`, req.body);
    
    const { title, category, description, price } = req.body;

    // Parse existing images that were kept
    let existingImages = req.body.existingImages || [];
    if (typeof existingImages === 'string') {
        existingImages = [existingImages];
    }

    try {
        let imageUrls = [...existingImages];
        let videoUrl = req.body.existingVideo || null;

        // Add newly uploaded files
        if (req.files) {
            if (req.files.images) {
                const newImageUrls = req.files.images.map(file => `/public/uploads/${file.filename}`);
                imageUrls = [...imageUrls, ...newImageUrls].slice(0, 10); // Cap at 10
            }
            if (req.files.video && req.files.video.length > 0) {
                videoUrl = `/public/uploads/${req.files.video[0].filename}`;
            }
        }

        const result = await pool.query(
            "UPDATE projects SET title = $1, category = $2, description = $3, price = $4, images = $5, video = $6 WHERE id = $7 RETURNING id AS _id, title, category, price, description, images, video",
            [title, category, description, price, imageUrls, videoUrl, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error updating project" });
    }
};

// Delete a project
const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM projects WHERE id = $1 RETURNING id", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ message: "Project deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error deleting project" });
    }
};

// Get a single project by ID (Public)
const getProjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "SELECT id AS _id, title, category, price, description, images, video FROM projects WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching project" });
    }
};

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    testDBConnection
};
