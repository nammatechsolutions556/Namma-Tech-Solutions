const express = require("express");
const { getMessages, createMessage, updateMessageStatus, deleteMessage } = require("../controllers/contactController");
const { protectAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public route to submit a form
router.post("/", createMessage);

// Protected admin routes to view, update, and delete messages
router.get("/", protectAdmin, getMessages);
router.put("/:id", protectAdmin, updateMessageStatus);
router.delete("/:id", protectAdmin, deleteMessage);

module.exports = router;
