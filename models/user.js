var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  hoVaTen: { type: String, required: true },
  hinhAnh: { type: String},
  tenDangNhap: { type: String, required: true, unique: true },
  matKhau: { type: String, required: true },
  donViId: { type: String, required: true },
  role: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
});
var UserModel = mongoose.model('UserModel', UserSchema);
module.exports = UserModel;