var PhongThietBiSchema = new mongoose.Schema({
    phongId: { type: Number, required: true },
    thietBiId: { type: Number, required: true },
    soLuong: { type: Number, required: true }
  });
  var RoomEquipmentModel = mongoose.model('RoomEquipmentModel', PhongThietBiSchema);
  module.exports = RoomEquipmentModel;