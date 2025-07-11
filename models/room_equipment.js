const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomEquipmentSchema = new Schema({
  room: {type: Schema.Types.ObjectId,ref: 'RoomModel',required: true},
  equipment: {type: Schema.Types.ObjectId,ref: 'EquipmentModel',required: true},
  trangThai: {type: Boolean,default: true}}, {
  timestamps: true
});

// Tạo index cho cặp room-equipment để đảm bảo không trùng lặp
roomEquipmentSchema.index({ room: 1, equipment: 1 }, { unique: true });
module.exports = mongoose.model('RoomEquipmentModel', roomEquipmentSchema);
