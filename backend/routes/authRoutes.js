const express = require("express");
const { adminLogin, registerClient, loginClient } = require("../controllers/authController");

const router = express.Router();

// Admin Auth Routes
router.post("/admin/login", adminLogin);

// Client Auth Routes
router.post("/client/register", registerClient);
router.post("/client/login", loginClient);

module.exports = router;
