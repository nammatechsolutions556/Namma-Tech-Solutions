const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Add auth middleware here if admin routes are protected
// const { protect } = require('../middleware/authMiddleware');

router.get('/', dashboardController.getDashboardStats);

module.exports = router;
