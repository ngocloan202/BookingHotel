const mongoose = require('mongoose');
const ServiceUsageSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'BookingModel', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceModel', required: true },
  soLuong: { type: Number, required: true },
  ngaySuDung: { type: Date, required: true }
});
module.exports = mongoose.model('ServiceUsageModel', ServiceUsageSchema);