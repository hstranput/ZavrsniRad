const mongoose = require('mongoose');

const CheckInSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  checkInTime: {
    type: Date,
    default: Date.now,
  },
  checkOutTime: {
    type: Date,
  },
});

module.exports = mongoose.model('CheckIn', CheckInSchema);