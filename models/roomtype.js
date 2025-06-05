const mongoose = require('mongoose');
const RoomTypeSchema = new mongoose.Schema({
    tenLoaiPhong: { type: String, required: true },
    donGia: { type: Number, required: true },
    soNguoiToiDa: { type: Number, required: true },
    soLuong: { type: Number, required: true },
    moTa: { type: String }
  });
module.exports = mongoose.model('RoomTypeModel', RoomTypeSchema);