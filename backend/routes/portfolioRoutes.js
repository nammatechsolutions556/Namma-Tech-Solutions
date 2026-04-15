const express = require("express");
const { getPortfolioProjects, createPortfolioProject, updatePortfolioProject, deletePortfolioProject } = require("../controllers/portfolioController");
const { protectAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/", getPortfolioProjects);

router.post(
    "/",
    protectAdmin,
    upload.fields([{ name: "video", maxCount: 1 }]),
    createPortfolioProject
);

router.put(
    "/:id",
    protectAdmin,
    upload.fields([{ name: "video", maxCount: 1 }]),
    updatePortfolioProject
);

router.delete("/:id", protectAdmin, deletePortfolioProject);

module.exports = router;
