const mongoose = require('mongoose');
const RoomSchema = new mongoose.Schema({
  tenPhong: { type: String, required: true },
  loaiPhong: { type: mongoose.Schema.Types.ObjectId, ref: 'RoomTypeModel', required: true },
  trangThai: { type: String, default: 'Trống' },
  giaPhong: { type: Number, required: true },
  ghiChu: { type: String },
  image: {type: String, default: 'default.jpg'}
});
module.exports = mongoose.model('Room', RoomSchema, 'roommodels');