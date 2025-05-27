var LoaiPhongSchema = new mongoose.Schema({
    loaiPhongId: { type: Number, required: true, unique: true },
    tenLoaiPhong: { type: String, required: true },
    donGia: { type: Number, required: true },
    soNguoiToiDa: { type: Number, required: true },
    soLuong: { type: Number, required: true }
  });
  var RoomTypeModel = mongoose.model('RoomTypeModel', LoaiPhongSchema);
  module.exports = RoomTypeModel;