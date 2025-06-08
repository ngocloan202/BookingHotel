const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const multer = require('multer');
const path = require('path');

// Cấu hình lưu file ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Middleware kiểm tra đăng nhập
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// GET: Hiển thị thông tin cá nhân
router.get('/', ensureAuthenticated, async (req, res) => {
  console.log('[DEBUG] session user:', req.session.user);
  const user = await UserModel.findById(req.session.user._id);
  if (!user) {
    return res.redirect('/login');
  }
  res.render('info', { user });
});

// POST: Cập nhật thông tin cá nhân
router.post('/', ensureAuthenticated, upload.single('hinhAnh'), async (req, res) => {
  const { hoVaTen, diaChi, ngaySinh, email, soDienThoai } = req.body;
  let updateData = { hoVaTen, diaChi, ngaySinh, email, soDienThoai };
  if (req.file) {
    updateData.hinhAnh = req.file.filename;
  }
  await UserModel.findByIdAndUpdate(req.session.user._id, updateData);
  // Cập nhật lại session user
  const updatedUser = await UserModel.findById(req.session.user._id);
  req.session.user = updatedUser;
  res.redirect('/info');
});

module.exports = router;
