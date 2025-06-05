const mongoose = require('mongoose');
const ServiceSchema = new mongoose.Schema({
  tenDichVu: { type: String, required: true },
  donGia: { type: Number, required: true }
});
module.exports = mongoose.model('ServiceModel', ServiceSchema);