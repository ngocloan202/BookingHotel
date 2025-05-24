var KhachHangSchema = new mongoose.Schema({
    khachHangId: { type: Number, required: true, unique: true },
    hoVaTen: { type: String, required: true },
    cccd: { type: String, required: true, unique: true },
    soDienThoai: { type: String },
    email: { type: String },
    diaChi: { type: String },
    quocTichId: { type: Number, required: true }
  });
  var CustomerModel = mongoose.model('CustomerModel', KhachHangSchema);
  module.exports = CustomerModel;