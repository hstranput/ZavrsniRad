const express = require('express');
const router = express.Router();

const { createUser, getAllUsers, deleteUser, getMyCheckIns } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');


router.route('/')
  .post(protect, admin, createUser)
  .get(protect, admin, getAllUsers);

router.route('/:id')
  .delete(protect, admin, deleteUser);


router.get('/my-checkins', protect, getMyCheckIns);

module.exports = router;