const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  userId: String // 👈 thêm dòng này
});

module.exports = mongoose.model('Product', productSchema);