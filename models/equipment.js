const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const equipmentSchema = new Schema({
  tenThietBi: {type: String,required: true},
  donGia: {type: Number,required: true,default: 0},
  moTa: {type: String}}, {
  timestamps: true
});
module.exports = mongoose.model('EquipmentModel', equipmentSchema);