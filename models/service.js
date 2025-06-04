var DichVuSchema = new mongoose.Schema({
    dichVuId: { type: Number, required: true, unique: true },
    tenDichVu: { type: String, required: true },
    donGia: { type: Number, required: true }
  });
  var ServiceModel = mongoose.model('ServiceModel', DichVuSchema);
  module.exports = ServiceModel;