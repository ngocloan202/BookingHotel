const mongoose = require('mongoose');
const BookingSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomerModel', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'RoomModel', required: true },
    ngayNhanPhong: { type: Date, required: true },
    ngayTraPhong: { type: Date, required: true },
    soNgayThue: { type: Number, required: true },
    trangThai: { type: String, default: 'Chờ xác nhận' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true },
    soNguoiLon: { type: Number, default: 1 },
    soTreEm: { type: Number, default: 0 },
    ngayDat: { type: Date, default: Date.now },
    tongTien: { type: Number }
  });
module.exports = mongoose.model('BookingModel', BookingSchema);
