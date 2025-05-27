var PhongSchema = new mongoose.Schema({
    phongId: { type: Number, required: true, unique: true },
    tenPhong: { type: String, required: true },
    loaiPhongId: { type: Number, required: true },
    trangThai: { type: String, default: 'Trống' },
    giaPhong: { type: Number, required: true },
    ghiChu: { type: String }
  });
  var RoomModel = mongoose.model('RoomModel', PhongSchema);
  module.exports = RoomModel;