const mongoose = require('mongoose');
const CustomerSchema = new mongoose.Schema({
    hoVaTen: { type: String, required: true },
    cccd: { type: String, required: true, unique: true },
    soDienThoai: { type: String },
    email: { type: String },
    diaChi: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: false },
    nationality: { type: mongoose.Schema.Types.ObjectId, ref: 'NationalityModel', required: true }
  });
module.exports = mongoose.model('CustomerModel', CustomerSchema);