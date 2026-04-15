const express = require("express");
const { getProjects, getProjectById, createProject, updateProject, deleteProject, testDBConnection } = require("../controllers/projectController");
const { protectAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Test routes for diagnosis
router.get("/test-connectivity", (req, res) => res.json({ message: "API Connectivity OK" }));
router.get("/test-db", testDBConnection);

// Public route to get all projects natively
router.get("/", getProjects);
router.get("/:id", getProjectById);

// Protected admin routes to manage projects
router.post(
    "/",
    protectAdmin,
    upload.fields([{ name: "images", maxCount: 10 }, { name: "video", maxCount: 1 }]),
    createProject
);

router.put(
    "/:id",
    protectAdmin,
    upload.fields([{ name: "images", maxCount: 10 }, { name: "video", maxCount: 1 }]),
    updateProject
);

router.delete("/:id", protectAdmin, deleteProject);

module.exports = router;
