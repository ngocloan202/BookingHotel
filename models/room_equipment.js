const mongoose = require('mongoose');
const RoomEquipmentSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'RoomModel', required: true },
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'EquipmentModel', required: true },
  soLuong: { type: Number, required: true }
});
module.exports = mongoose.model('RoomEquipmentModel', RoomEquipmentSchema);