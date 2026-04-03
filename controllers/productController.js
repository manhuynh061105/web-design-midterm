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

  await Product.create({
    ...req.body,
    userId: req.session.user.id
  });
  console.log(req.body);

  res.redirect('/');
};