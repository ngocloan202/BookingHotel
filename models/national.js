var QuocTichSchema = new mongoose.Schema({
    quocTichId: { type: Number, required: true, unique: true },
    tenQuocGia: { type: String, required: true }
  });
  var NationalityModel = mongoose.model('NationalityModel', QuocTichSchema);
  module.exports = NationalityModel;