const User = require('../models/User');

// form đăng ký
exports.registerForm = (req, res) => {
  res.render('register');
};

// xử lý đăng ký
exports.register = async (req, res) => {
  const { username, password } = req.body;
  await User.create({ username, password });
  res.redirect('/login');
};

// form login
exports.loginForm = (req, res) => {
  res.render('login');
};

// xử lý login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });

  if (!user) return res.send('Sai tài khoản');

  req.session.user = {
  id: user._id,        // 👈 chuẩn
  username: user.username
  };
  res.redirect('/'); // 👉 về trang chủ
};

// logout
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};

