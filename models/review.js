var mongoose = require('mongoose');

var ReviewSchema = new mongoose.Schema({
  reviewId: { type: Number, required: true, unique: true },
  phongId: { type: Number, required: true },            
  khachHangId: { type: Number, required: true },     
  soSao: { type: Number, required: true, min: 1, max: 5 }, 
  noiDung: { type: String, required: true },           
  ngayDanhGia: { type: Date, default: Date.now },       
  hienThi: { type: Boolean, default: true }             
});

var ReviewModel = mongoose.model('ReviewModel', ReviewSchema);
module.exports = ReviewModel;
