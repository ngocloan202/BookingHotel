const mongoose = require('mongoose');
const EquipmentSchema = new mongoose.Schema({
  tenThietBi: { type: String, required: true },
  donGia: { type: Number, required: true }
});
module.exports = mongoose.model('EquipmentModel', EquipmentSchema);