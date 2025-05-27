var ThietBiSchema = new mongoose.Schema({
    thietBiId: { type: Number, required: true, unique: true },
    tenThietBi: { type: String, required: true },
    donGia: { type: Number, required: true }
  });
  var EquipmentModel = mongoose.model('EquipmentModel', ThietBiSchema);
  module.exports = EquipmentModel;