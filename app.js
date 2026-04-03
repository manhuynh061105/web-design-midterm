const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes.js');
const productCtrl = require('./controllers/productController');
const Product = require('./models/Product');
const multer = require('multer');
const path = require('path');

// setup multer storage to public/img/products
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public', 'img', 'products'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, name);
  }
});
const upload = multer({ storage });

// ⚠️ middleware phải ở trên cùng
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'abc',
  resave: false,
  saveUninitialized: true
}));

app.set('view engine', 'ejs');

// make session user available in all views
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// Routes
app.get('/', productCtrl.index);

app.get('/products/new', productCtrl.newForm);
// use multer middleware for image upload (field name `image`)
app.post('/products', upload.single('image'), productCtrl.create);

app.get('/products/:id', productCtrl.detail);

app.use('/', userRoutes);

// DEBUG route: list products for current session user (JSON)
app.get('/debug/products', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'not logged in' });
  const products = await Product.find({ userId: req.session.user.id });
  res.json(products);
});

// DB
mongoose.connect('mongodb://127.0.0.1:27017/shop')
  .then(() => console.log('✅ Đã kết nối MongoDB'))
  .catch(err => console.log('❌ Lỗi MongoDB:', err));

app.listen(3000, () => console.log('Server chạy cổng 3000'));