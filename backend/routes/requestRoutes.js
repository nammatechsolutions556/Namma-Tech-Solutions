const express = require("express");
const { getRequests, getClientRequests, createRequest, updateRequestStatus, deleteRequest } = require("../controllers/requestController");
const { protectAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public route to submit a project request
router.post("/", createRequest);

// Client route to get their own requests
router.get("/client", getClientRequests);

// Protected admin routes to view, update, and delete requests
router.get("/", protectAdmin, getRequests);
router.put("/:id", protectAdmin, updateRequestStatus);
router.delete("/:id", protectAdmin, deleteRequest);

module.exports = router;
