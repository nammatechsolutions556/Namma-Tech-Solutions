const pool = require("../config/db");

// Get all portfolio projects
const getPortfolioProjects = async (req, res) => {
    try {
        const result = await pool.query("SELECT id AS _id, title, category, price, description, video, completed_date FROM portfolio_projects ORDER BY completed_date DESC, created_at DESC");
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
        let videoUrl = null;

        if (req.files && req.files.video && req.files.video.length > 0) {
            videoUrl = req.files.video[0].path;
        }

        const query = `
            INSERT INTO portfolio_projects (title, category, description, price, completed_date, video) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING id AS _id, title, category, price, description, completed_date, video
        `;
        const result = await pool.query(query, [
            title, category, description, price, completed_date || null, videoUrl
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
    let videoUrl = req.body.existingVideo || null;

    try {
        if (req.files && req.files.video && req.files.video.length > 0) {
            videoUrl = req.files.video[0].path;
        }

        const query = `
            UPDATE portfolio_projects 
            SET title = $1, category = $2, description = $3, price = $4, completed_date = $5, video = $6 
            WHERE id = $7 
            RETURNING id AS _id, title, category, price, description, completed_date, video
        `;
        const result = await pool.query(query, [
            title, category, description, price, completed_date || null, videoUrl, id
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

// Get a single portfolio project by ID
const getPortfolioProjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT id AS _id, title, category, price, description, video, completed_date FROM portfolio_projects WHERE id = $1", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Portfolio project not found" });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching portfolio project" });
    }
};

module.exports = {
    getPortfolioProjects,
    getPortfolioProjectById,
    createPortfolioProject,
    updatePortfolioProject,
    deletePortfolioProject
};
