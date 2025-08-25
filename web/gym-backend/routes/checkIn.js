const express = require('express');
const router = express.Router();
const { qrCheckIn } = require('../controllers/checkInController'); 
const { protect } = require('../middleware/authMiddleware');


router.post('/qr', protect, qrCheckIn); 

module.exports = router;