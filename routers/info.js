const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/login');
}

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    console.log('Session:', req.session);
    console.log('User ID:', req.session.user?._id);
    
    if (!req.session.user?._id) {
      console.log('No user ID found in session');
      return res.redirect('/login');
    }

    const user = await UserModel.findById(req.session.user._id);
    if (!user) {
      console.log('User not found in database');
      return res.redirect('/login');
    }

    res.render('info', { user });
  } catch (error) {
    console.error('Error in info route:', error);
    res.redirect('/login');
  }
});

router.post('/', ensureAuthenticated, upload.single('hinhAnh'), async (req, res) => {
  const { hoVaTen, diaChi, ngaySinh, email, soDienThoai } = req.body;
  let updateData = { hoVaTen, diaChi, ngaySinh, email, soDienThoai };
  if (req.file) {
    updateData.hinhAnh = req.file.filename;
  }
  await UserModel.findByIdAndUpdate(req.session.user._id, updateData);
  const updatedUser = await UserModel.findById(req.session.user._id);
  req.session.user = updatedUser;
  res.redirect('/info');
});

module.exports = router;
