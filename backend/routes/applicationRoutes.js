const express = require("express");
const { getApplications, getClientApplications, createApplication, updateApplicationStatus, deleteApplication } = require("../controllers/applicationController");
const { protectAdmin } = require("../middlewares/authMiddleware");

const upload = require("../middlewares/uploadMiddleware");
const router = express.Router();

// Public route to submit an internship application with resume
router.post("/", upload.single('resume'), createApplication);

// Client route to get their own applications
router.get("/client", getClientApplications);

// Protected admin routes to view, update, and delete applications
router.get("/", protectAdmin, getApplications);
router.put("/:id", protectAdmin, updateApplicationStatus);
router.delete("/:id", protectAdmin, deleteApplication);

module.exports = router;
