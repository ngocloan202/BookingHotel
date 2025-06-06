const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const equipmentSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  tenThietBi: {
    type: String,
    required: true
  },
  donGia: {
    type: Number,
    required: true,
    default: 0
  },
  moTa: {
    type: String
  }
}, {
  timestamps: true
});

mongoose.model('EquipmentModel', equipmentSchema);