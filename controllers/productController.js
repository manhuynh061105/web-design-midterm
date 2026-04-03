const Product = require('../models/Product');

exports.index = async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const q = req.query.q;

  let filter = {
    userId: req.session.user.id // 👈 LUÔN lọc theo user
  };

  if (q) {
    filter.name = { $regex: q, $options: 'i' }; // 👈 thêm điều kiện search
  }

  const products = await Product.find(filter);

  res.render('shop', {
    products,
    user: req.session.user,
    q
  });
};

exports.detail = async (req, res) => {
  const product = await Product.findById(req.params.id);

  res.render('detail', {
    product,
    user: req.session.user
  });
};

exports.newForm = (req, res) => {
  res.render('newProduct', {
    user: req.session.user
  });
};

exports.create = async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login'); // 👈 chưa login thì quay về login
  }
  const data = {
    ...req.body,
    userId: req.session.user.id
  };

  // nếu có file được upload bởi multer, lưu đường dẫn tương đối
  if (req.file) {
    // store path relative to /public, e.g. /img/products/xxx.jpg
    data.image = '/img/products/' + req.file.filename;
  }

  // convert stock to number if provided
  if (data.stock) {
    data.stock = Number(data.stock);
    if (Number.isNaN(data.stock)) data.stock = 0;
  } else {
    data.stock = 0;
  }

  console.log('CREATE product data:', data);
  await Product.create(data);

  res.redirect('/');
};