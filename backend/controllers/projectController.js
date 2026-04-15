const pool = require("../config/db");

// Get all projects
const getProjects = async (req, res) => {
    try {
        const result = await pool.query("SELECT id AS _id, title, category, price, description, video FROM projects ORDER BY created_at DESC");
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
    const { title, category, description, price } = req.body;

    // Early validation after Multer parsing
    if (!title || !category || !description) {
        console.warn(`[${timestamp}] [WARN] Missing fields:`, { title: !!title, category: !!category, description: !!description });
        return res.status(400).json({ message: "Title, Category, and Description are required." });
    }
    try {
        let videoUrl = null;

        if (req.files) {
            console.log(`[${timestamp}] [DEBUG] Files received:`, Object.keys(req.files));
            if (req.files.video && req.files.video.length > 0) {
                console.log(`[${timestamp}] [DEBUG] Mapping video: ${req.files.video[0].originalname}`);
                videoUrl = `/public/uploads/${req.files.video[0].filename}`;
            }
        } else {
            console.log(`[${timestamp}] [DEBUG] No files received in request.`);
        }

        console.log(`[${timestamp}] [DEBUG] Executing DB INSERT for project: "${title.trim()}"`);
        
        // Use a longer timeout (30s) for cloud databases
        const queryPromise = pool.query(
            "INSERT INTO projects (title, category, description, price, video) VALUES ($1, $2, $3, $4, $5) RETURNING id AS _id, title, category, price, description, video",
            [title.trim(), category.trim(), description.trim(), price ? price.trim() : "", videoUrl]
        );

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Database query timeout (30s)")), 30000)
        );

        const result = await Promise.race([queryPromise, timeoutPromise]);
        
        console.log(`[${timestamp}] [DEBUG] DB INSERT successful. New ID: ${result.rows[0]._id}`);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(`[${timestamp}] [ERROR] createProject failed at step: ${err.message}`);
        console.error(`[${timestamp}] [ERROR_DETAILS]`, err);
        const status = err.message.includes("timeout") ? 504 : 500;
        res.status(status).json({ 
            message: "Failed to create project", 
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
        });
    }
};

// Update a project
const updateProject = async (req, res) => {
    const { id } = req.params;
    console.log(`[DEBUG] updateProject reached for ID: ${id}. Body:`, req.body);
    
    const { title, category, description, price } = req.body;

    try {
        let videoUrl = req.body.existingVideo || null;

        // Add newly uploaded files
        if (req.files) {
            if (req.files.video && req.files.video.length > 0) {
                videoUrl = `/public/uploads/${req.files.video[0].filename}`;
            }
        }

        const result = await pool.query(
            "UPDATE projects SET title = $1, category = $2, description = $3, price = $4, video = $5 WHERE id = $6 RETURNING id AS _id, title, category, price, description, video",
            [title, category, description, price, videoUrl, id]
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
            "SELECT id AS _id, title, category, price, description, video FROM projects WHERE id = $1",
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
    deleteProject
};
