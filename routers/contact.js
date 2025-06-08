const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

//feedback khách hàng
router.get('/', async (req, res) => {
  res.render('contact', { title: 'Liên hệ' });
});

router.post('/', async (req, res) => {
  const { hoVaTen, email, tieuDe, tinNhan } = req.body;

  try {
    await Contact.create({ hoVaTen, email, tieuDe, tinNhan });
    req.flash('success_msg', 'Đã gửi tin nhắn thành công!');
    res.redirect('/contact');
  } catch (err) {
    console.error('Lỗi khi gửi liên hệ:', err);
    req.flash('error_msg', 'Gửi tin nhắn thất bại.');
    res.redirect('/contact');
  }
});

module.exports = router;