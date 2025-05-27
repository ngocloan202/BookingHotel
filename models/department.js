var DonViSchema = new mongoose.Schema({
    donViId: { type: String, required: true, unique: true },
    tenDonVi: { type: String, required: true },
    soDienThoai: { type: String, required: true },
    fax: { type: String },
    email: { type: String },
    diaChi: { type: String },
    congTyId: { type: String, required: true },
    trangThaiHoatDong: { type: Boolean, default: true }
  });
  var DepartmentModel = mongoose.model('DepartmentModel', DonViSchema);
  module.exports = DepartmentModel;