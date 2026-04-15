const express = require("express");
const { getInternships, getInternshipById, createInternship, updateInternship, deleteInternship } = require("../controllers/internshipController");
const { protectAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public route to view internships
router.get("/", getInternships);
router.get("/:id", getInternshipById);

// Protected admin routes to create, update, and delete internships
router.post("/", protectAdmin, createInternship);
router.put("/:id", protectAdmin, updateInternship);
router.delete("/:id", protectAdmin, deleteInternship);

module.exports = router;
