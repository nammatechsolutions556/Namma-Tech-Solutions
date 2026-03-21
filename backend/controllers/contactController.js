const pool = require("../config/db");

// Get all contact messages (Admin)
const getMessages = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id AS _id, name, email, mobile, subject, message, status, created_at FROM contact_messages ORDER BY created_at DESC"
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching contact messages" });
    }
};

// Create a new contact message (Public API)
const createMessage = async (req, res) => {
    const { name, email, mobile, subject, message } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO contact_messages (name, email, mobile, subject, message) VALUES ($1, $2, $3, $4, $5) RETURNING id AS _id, name, email, mobile, subject, status",
            [name, email, mobile, subject, message]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error creating contact message" });
    }
};

// Update message status (Admin) - e.g., mark as 'Read'
const updateMessageStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await pool.query(
            "UPDATE contact_messages SET status = $1 WHERE id = $2 RETURNING id AS _id, name, status",
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error updating message status" });
    }
};

// Delete a message (Admin)
const deleteMessage = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM contact_messages WHERE id = $1 RETURNING id", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.status(200).json({ message: "Message deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error deleting message" });
    }
};

module.exports = {
    getMessages,
    createMessage,
    updateMessageStatus,
    deleteMessage
};
