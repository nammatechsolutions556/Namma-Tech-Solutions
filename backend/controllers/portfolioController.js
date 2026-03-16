const pool = require("../config/db");

// Get all portfolio projects
const getPortfolioProjects = async (req, res) => {
    try {
        const result = await pool.query("SELECT id AS _id, title, category, price, description, images, videos, completed_date FROM portfolio_projects ORDER BY completed_date DESC, created_at DESC");
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching portfolio projects" });
    }
};

// Create a new portfolio project
const createPortfolioProject = async (req, res) => {
    const { title, category, description, price, completed_date } = req.body;
    try {
        let imageUrls = [];
        let videoUrls = [];

        if (req.files) {
            if (req.files.images) {
                imageUrls = req.files.images.map(file => `/public/uploads/${file.filename}`);
            }
            if (req.files.videos && req.files.videos.length > 0) {
                videoUrls = req.files.videos.map(file => `/public/uploads/${file.filename}`);
            }
        }

        const query = `
            INSERT INTO portfolio_projects (title, category, description, price, completed_date, images, videos) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING id AS _id, title, category, price, description, completed_date, images, videos
        `;
        const result = await pool.query(query, [
            title, category, description, price, completed_date || null, imageUrls, videoUrls
        ]);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error creating portfolio project" });
    }
};

// Update a portfolio project
const updatePortfolioProject = async (req, res) => {
    const { id } = req.params;
    const { title, category, description, price, completed_date } = req.body;

    // Parse existing media that were kept
    let existingImages = req.body.existingImages || [];
    if (typeof existingImages === 'string') {
        existingImages = [existingImages];
    }

    let existingVideos = req.body.existingVideos || [];
    if (typeof existingVideos === 'string') {
        existingVideos = [existingVideos];
    }

    try {
        let imageUrls = [...existingImages];
        let videoUrls = [...existingVideos];

        // Add newly uploaded files
        if (req.files) {
            if (req.files.images) {
                const newImageUrls = req.files.images.map(file => `/public/uploads/${file.filename}`);
                imageUrls = [...imageUrls, ...newImageUrls].slice(0, 20); // Cap at 20 images
            }
            if (req.files.videos) {
                const newVideoUrls = req.files.videos.map(file => `/public/uploads/${file.filename}`);
                videoUrls = [...videoUrls, ...newVideoUrls].slice(0, 2); // Cap at 2 videos
            }
        }

        const query = `
            UPDATE portfolio_projects 
            SET title = $1, category = $2, description = $3, price = $4, completed_date = $5, images = $6, videos = $7 
            WHERE id = $8 
            RETURNING id AS _id, title, category, price, description, completed_date, images, videos
        `;
        const result = await pool.query(query, [
            title, category, description, price, completed_date || null, imageUrls, videoUrls, id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Portfolio project not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error updating portfolio project" });
    }
};

// Delete a portfolio project
const deletePortfolioProject = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM portfolio_projects WHERE id = $1 RETURNING id", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Portfolio project not found" });
        }

        res.status(200).json({ message: "Portfolio project deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error deleting portfolio project" });
    }
};

module.exports = {
    getPortfolioProjects,
    createPortfolioProject,
    updatePortfolioProject,
    deletePortfolioProject
};
