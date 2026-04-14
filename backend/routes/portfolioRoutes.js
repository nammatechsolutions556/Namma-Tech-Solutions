const express = require("express");
const { getPortfolioProjects, createPortfolioProject, updatePortfolioProject, deletePortfolioProject } = require("../controllers/portfolioController");
const { protectAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/", getPortfolioProjects);

router.post(
    "/",
    protectAdmin,
    upload.fields([{ name: "images", maxCount: 20 }, { name: "videos", maxCount: 2 }]),
    createPortfolioProject
);

router.put(
    "/:id",
    protectAdmin,
    upload.fields([{ name: "images", maxCount: 20 }, { name: "videos", maxCount: 2 }]),
    updatePortfolioProject
);

router.delete("/:id", protectAdmin, deletePortfolioProject);

module.exports = router;
