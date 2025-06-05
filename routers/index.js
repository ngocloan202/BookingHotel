const express = require('express'); 
const router = express.Router(); 

// Trang chủ: nếu đã đăng nhập thì chuyển đến dashboard nếu là admin
router.get('/', (req, res) => { 
  if (req.session.user && req.session.user.role === 'admin') {
    return res.redirect('/dashboard');
  }
  res.render('index', { title: 'Trang chủ' });
});

// Auth views
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

// Admin dashboard
router.get('/dashboard', (req, res) => res.render('dashboard'));

// Booking views
router.get('/bookingroom', (req, res) => res.render('bookingroom'));
router.get('/confirmpayment', (req, res) => res.render('confirmpayment'));
router.get('/newbookingroom', (req, res) => res.render('newbookingroom'));
router.get('/historybooking', (req, res) => res.render('historybooking'));
router.get('/customer_booking', (req, res) => res.render('customer_booking'));

// Room views
router.get('/room', (req, res) => res.render('room'));
router.get('/room_detail', (req, res) => res.render('room_detail'));

// Optional: các trang thông báo
router.get('/error', (req, res) => res.render('error', { title: 'Lỗi' }));
router.get('/success', (req, res) => res.render('success', { title: 'Thành công' }));

module.exports = router;
