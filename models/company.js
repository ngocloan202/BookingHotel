var CongTySchema = new mongoose.Schema({
    congTyId: { type: String, required: true, unique: true },
    tenCongTy: { type: String, required: true },
    soDienThoai: { type: String },
    fax: { type: String },
    email: { type: String },
    diaChi: { type: String }
  });
  var CompanyModel = mongoose.model('CompanyModel', CongTySchema);
  module.exports = CompanyModel;