const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  hoVaTen: { type: String, required: true },
  hinhAnh: { type: String },
  tenDangNhap: { type: String, required: true, unique: true },
  matKhau: { type: String, required: true },
  diaChi: { type: String },
  ngaySinh: { type: Date },
  email: { type: String },
  soDienThoai: { type: String },
  role: { type: Boolean, default: false }
});
module.exports = mongoose.model('UserModel', UserSchema);