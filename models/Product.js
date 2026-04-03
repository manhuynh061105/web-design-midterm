const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  userId: String, // 👈 thêm dòng này
  image: String, // relative path under /img/products, optional
  description: String,
  stock: Number
});

module.exports = mongoose.model('Product', productSchema);