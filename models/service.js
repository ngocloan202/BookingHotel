const mongoose = require('mongoose');
const ServiceSchema = new mongoose.Schema({
  tenDichVu: { type: String, required: true },
  donGia: { type: Number, required: true },
  thoiGianPhucVu: { type: String, required: true },
  hinhAnh: { type: String, default: 'default-service.jpg' },
  trangThai: { type: String, enum: ['Hoạt động', 'Tạm dừng'], default: 'Hoạt động' } 
});
module.exports = mongoose.model('ServiceModel', ServiceSchema);