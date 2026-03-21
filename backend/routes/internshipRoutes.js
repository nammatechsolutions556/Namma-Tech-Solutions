const express = require("express");
const { getInternships, createInternship, updateInternship, deleteInternship } = require("../controllers/internshipController");
const { protectAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public route to view internships
router.get("/", getInternships);

// Protected admin routes to create, update, and delete internships
router.post("/", protectAdmin, createInternship);
router.put("/:id", protectAdmin, updateInternship);
router.delete("/:id", protectAdmin, deleteInternship);

module.exports = router;
