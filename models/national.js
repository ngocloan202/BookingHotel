const mongoose = require('mongoose');
const NationalitySchema = new mongoose.Schema({
    tenQuocGia: { type: String, required: true }
  });
module.exports = mongoose.model('NationalityModel', NationalitySchema);