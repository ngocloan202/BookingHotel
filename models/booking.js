var DatPhongSchema = new mongoose.Schema({
    datPhongId: { type: Number, required: true, unique: true },
    khachHangId: { type: Number, required: true },
    phongId: { type: Number, required: true },
    ngayNhanPhong: { type: Date, required: true },
    ngayTraPhong: { type: Date, required: true },
    soNgayThue: { type: Number, required: true },
    trangThai: { type: String, default: 'Chờ xác nhận' },
    uid: { type: String, required: true },
    donViId: { type: String, required: true }
  });
  var BookingModel = mongoose.model('BookingModel', DatPhongSchema);
  module.exports = BookingModel;