const mongoose = require('mongoose');
const BillSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'BookingModel', required: true },
  ngayLap: { type: Date, required: true },
  tongTien: { type: Number, required: true },
  trangThaiThanhToan: { type: String, default: 'Chưa thanh toán' },
  ghiChu: { type: String }
});
module.exports = mongoose.model('BillModel', BillSchema);

  