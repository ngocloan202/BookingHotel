var HoaDonSchema = new mongoose.Schema({
    hoaDonId: { type: Number, required: true, unique: true },
    datPhongId: { type: Number, required: true },
    ngayLap: { type: Date, required: true },
    ghiChu: { type: String }
  });
  var BillModel = mongoose.model('BillModel', HoaDonSchema);
  module.exports = BillModel;