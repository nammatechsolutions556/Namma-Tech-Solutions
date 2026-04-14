const pool = require("../config/db");

// Get all requests
const getRequests = async (req, res) => {
    try {
        const result = await pool.query("SELECT id AS _id, name, email, phone, project, budget, requirements, status FROM project_requests ORDER BY created_at DESC");
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching project requests" });
    }
};

// Get requests by email for a client
const getClientRequests = async (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ message: "Email query parameter is required" });
    }

    try {
        const result = await pool.query(
            "SELECT id AS _id, name, email, phone, project, budget, requirements, status FROM project_requests WHERE email = $1 ORDER BY created_at DESC",
            [email]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching client requests:", err);
        res.status(500).json({ message: "Server error fetching client requests" });
    }
};

// Create a new request (Used by the Client Frontend)
const createRequest = async (req, res) => {
    const { name, email, phone, project, budget, requirements } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO project_requests (name, email, phone, project, budget, requirements, status) VALUES ($1, $2, $3, $4, $5, $6, 'Pending') RETURNING id AS _id, name, email, project, status",
            [name, email, phone, project, budget || null, requirements]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error creating project request" });
    }
};

// Update request status (Approve / Reject) (Used by the Admin Frontend)
const updateRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await pool.query(
            "UPDATE project_requests SET status = $1 WHERE id = $2 RETURNING id AS _id, name, project, status",
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Project request not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error updating project request status" });
    }
};

// Delete a request
const deleteRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM project_requests WHERE id = $1 RETURNING id", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Project request not found" });
        }

        res.status(200).json({ message: "Project request deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error deleting project request" });
    }
};

module.exports = {
    getRequests,
    getClientRequests,
    createRequest,
    updateRequestStatus,
    deleteRequest
};
