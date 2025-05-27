var SuDungDichVuSchema = new mongoose.Schema({
    suDungId: { type: Number, required: true, unique: true },
    datPhongId: { type: Number, required: true },
    dichVuId: { type: Number, required: true },
    soLuong: { type: Number, required: true },
    ngaySuDung: { type: Date, required: true }
  });
  var ServiceUsageModel = mongoose.model('ServiceUsageModel', SuDungDichVuSchema);
  module.exports = ServiceUsageModel;