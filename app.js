const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes.js');
const productCtrl = require('./controllers/productController');

// ⚠️ middleware phải ở trên cùng
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'abc',
  resave: false,
  saveUninitialized: true
}));

app.set('view engine', 'ejs');

// Routes
app.get('/', productCtrl.index);

app.get('/products/new', productCtrl.newForm);
app.post('/products', productCtrl.create);

app.get('/products/:id', productCtrl.detail);

app.use('/', userRoutes);

// DB
mongoose.connect('mongodb://127.0.0.1:27017/shop')
  .then(() => console.log('✅ Đã kết nối MongoDB'))
  .catch(err => console.log('❌ Lỗi MongoDB:', err));

app.listen(3000, () => console.log('Server chạy cổng 3000'));