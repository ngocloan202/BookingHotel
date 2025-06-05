const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'RoomModel', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomerModel', required: true },
  soSao: { type: Number, required: true, min: 1, max: 5 },
  noiDung: { type: String, required: true },
  ngayDanhGia: { type: Date, default: Date.now },
  hienThi: { type: Boolean, default: true }
});
module.exports = mongoose.model('ReviewModel', ReviewSchema);