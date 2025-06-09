const mongoose = require('mongoose');
const ContactSchema = new mongoose.Schema({
  hoVaTen: { type: String, required: true },
  email: { type: String, required: true },
  tieuDe: { type: String, required: true },
  tinNhan: { type: String, required: true },
  ngayGui: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactModel', ContactSchema);
