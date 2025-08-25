const mongoose = require('mongoose');

const SensorDataSchema = new mongoose.Schema({
  sensorId: { type: String, required: true },
  temperatura: { type: Number },
  tlak: { type: Number },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SensorData', SensorDataSchema); 