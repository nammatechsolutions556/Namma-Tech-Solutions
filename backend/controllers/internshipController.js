const pool = require("../config/db");

// Get all internships (Public & Admin)
const getInternships = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id AS _id, title, description, durations FROM internships ORDER BY created_at DESC"
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching internships" });
    }
};

// Create a new internship (Admin)
const createInternship = async (req, res) => {
    const { title, description, durations } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO internships (title, description, durations) VALUES ($1, $2, $3::jsonb) RETURNING id AS _id, title, description, durations",
            [title, description, JSON.stringify(durations)]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error creating internship" });
    }
};

// Update an internship (Admin)
const updateInternship = async (req, res) => {
    const { id } = req.params;
    const { title, description, durations } = req.body;
    try {
        const result = await pool.query(
            "UPDATE internships SET title = $1, description = $2, durations = $3::jsonb WHERE id = $4 RETURNING id AS _id, title, description, durations",
            [title, description, JSON.stringify(durations), id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Internship not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error updating internship" });
    }
};

// Delete an internship (Admin)
const deleteInternship = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM internships WHERE id = $1 RETURNING id", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Internship not found" });
        }

        res.status(200).json({ message: "Internship deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error deleting internship" });
    }
};

// Get a single internship by ID (Public)
const getInternshipById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "SELECT id AS _id, title, description, durations FROM internships WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Internship not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching internship" });
    }
};

module.exports = {
    getInternships,
    getInternshipById,
    createInternship,
    updateInternship,
    deleteInternship
};
