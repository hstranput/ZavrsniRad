const express = require('express');
const router = express.Router();
const { getLatestSensorData, getOccupancy, getMonthlyVisits, getDailyStats } = require('../controllers/statsController');
const { protect, admin } = require('../middleware/authMiddleware');


router.get('/latest', protect, getLatestSensorData);
router.get('/occupancy', protect, getOccupancy);
router.get('/daily', protect, admin, getDailyStats);


router.get('/monthly-visits', protect, admin, getMonthlyVisits);

module.exports = router;