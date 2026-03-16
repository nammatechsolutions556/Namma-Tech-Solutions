const pool = require("../config/db");

// Get all internship applications (Admin)
const getApplications = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id AS _id, name, email, phone, domain || ' - ' || duration AS internship, status, resume_url FROM internship_applications ORDER BY created_at DESC"
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching internship applications" });
    }
};

// Get internship applications by email for a client
const getClientApplications = async (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ message: "Email query parameter is required" });
    }

    try {
        const result = await pool.query(
            "SELECT id AS _id, name, email, phone, domain || ' - ' || duration AS internship, duration, status, resume_url FROM internship_applications WHERE email = $1 ORDER BY created_at DESC",
            [email]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching client applications:", err);
        res.status(500).json({ message: "Server error fetching client applications" });
    }
};

// Create a new internship application (Client)
const createApplication = async (req, res) => {
    const { name, email, phone, domain, duration, price, college, course, interest } = req.body;
    const resume_url = req.file ? `/public/uploads/${req.file.filename}` : null;
    try {
        const result = await pool.query(
            "INSERT INTO internship_applications (name, email, phone, domain, duration, price, college, course, interest, resume_url, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Pending') RETURNING id AS _id, name, email, domain, status, resume_url",
            [name, email, phone, domain, duration, price, college, course, interest, resume_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error creating internship application" });
    }
};

// Update internship application status (Approve / Reject) (Admin)
const updateApplicationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await pool.query(
            "UPDATE internship_applications SET status = $1 WHERE id = $2 RETURNING id AS _id, name, status",
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Internship application not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error updating internship application status" });
    }
};

// Delete an internship application (Admin)
const deleteApplication = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM internship_applications WHERE id = $1 RETURNING id", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Internship application not found" });
        }

        res.status(200).json({ message: "Internship application deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error deleting internship application" });
    }
};

module.exports = {
    getApplications,
    getClientApplications,
    createApplication,
    updateApplicationStatus,
    deleteApplication
};
