const express = require("express");
const { getPortfolioProjects, getPortfolioProjectById, createPortfolioProject, updatePortfolioProject, deletePortfolioProject } = require("../controllers/portfolioController");
const { protectAdmin } = require("../middlewares/authMiddleware");
const { cloudinaryUpload: upload } = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/", getPortfolioProjects);
router.get("/:id", getPortfolioProjectById);

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
