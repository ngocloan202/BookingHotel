const express = require('express'); 
const router = express.Router(); 

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const multer = require('multer'); //để load ảnh từ máy

//import model
const User = require('../models/user');
const RoomType = require('../models/roomtype');
const Room = require('../models/room');
const Booking = require('../models/booking');
const Customer = require('../models/customer');
const Review = require('../models/review');
const Bill = require('../models/bill');
const Contact = require('../models/contact');

// Trang chủ: nếu đã đăng nhập thì chuyển đến dashboard nếu là admin
router.get('/', (req, res) => {
  if (req.session.user && req.session.user.role === true) {
    return res.redirect('/dashboard');
  }

  res.locals.title = 'Trang chủ'; 
  res.render('index'); //  không ghi đè user
});

// Auth views
router.get('/login', (req, res) => res.render('login'));
//xử lí login
router.post('/login', async (req, res) => {
  const { tenDangNhap, matKhau } = req.body;

  try {
    const user = await User.findOne({ tenDangNhap });
    if (!user) return res.send('Tên đăng nhập không tồn tại');

    const isMatch = await bcrypt.compare(matKhau, user.matKhau);
    if (!isMatch) return res.send('Sai mật khẩu');

    req.session.user = {
      _id: user._id,
      tenDangNhap: user.tenDangNhap,
      hoVaTen: user.hoVaTen,          
      hinhAnh: user.hinhAnh,
      role: user.role                
    };

    // Điều hướng theo quyền
    if (user.role === true) {
      return res.redirect('/dashboard'); 
    } else {
      return res.redirect('/'); 
    }

  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server');
  }
});
router.get('/logout', (req, res) => {
  req.flash('success_msg', 'Đăng xuất thành công!'); 
  req.session.destroy(err => {
    if (err) {
      console.error('Lỗi khi đăng xuất:', err);
      return res.redirect('/');
    }
    res.redirect('/'); 
  });
});

// Cấu hình multer lưu ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images'); // thư mục lưu ảnh
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });
//xử lí đăng ký
router.get('/register', (req, res) => res.render('register'));

router.post('/register', upload.single('hinhAnh'), async (req, res) => {
  const {
    hoVaTen, email, soDienThoai, diaChi, tenDangNhap,
    ngaySinh, matKhau, matKhauLai
  } = req.body;

  // Kiểm tra nhập lại mật khẩu
  if (matKhau !== matKhauLai) {
    req.flash('error_msg', 'Mật khẩu nhập lại không khớp!');
    return res.redirect('/register');
  }

  try {
    // Kiểm tra tên đăng nhập tồn tại chưa
    const existingUser = await User.findOne({ tenDangNhap });
    if (existingUser) {
      req.flash('error_msg', 'Tên đăng nhập đã tồn tại!');
      return res.redirect('/register');
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(matKhau, 12);

    // Tạo user mới
    const newUser = new User({
      hoVaTen,
      email,
      soDienThoai,
      diaChi,
      tenDangNhap,
      ngaySinh,
      matKhau: hashedPassword,
      hinhAnh: req.file ? req.file.filename : null,
      role: false, // là khách
    });

    await newUser.save();

    req.flash('success_msg', 'Đăng ký thành công! Hãy đăng nhập.');
    res.redirect('/login');
  } catch (err) {
    console.error('Lỗi đăng ký:', err);
    req.flash('error_msg', 'Đăng ký thất bại!');
    res.redirect('/register');
  }
});

// Admin dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const [
      roomTypeCount,
      roomCount,
      pendingBookingCount,       //Số đơn "Chờ xác nhận"
      bookedRoomCount,
      availableRoomCount,
      ratingCount,
      registeredCustomers,
      feedbackCustomer,
      cancelledRooms,
      bills                       // Danh sách hóa đơn (để tính doanh thu)
    ] = await Promise.all([
      RoomType.countDocuments(),
      Room.countDocuments(),
      Booking.countDocuments({ trangThai: 'Chờ xác nhận' }), // 
      Booking.countDocuments({ trangThai: 'Đã xác nhận' }),
      Room.countDocuments({ trangThai: 'Trống' }),
      Review.countDocuments(),
      Customer.countDocuments(),
      Contact.countDocuments(),
      Booking.countDocuments({ trangThai: 'Đã hủy đơn' }),
      Bill.find()
    ]);
    // Tính tổng doanh thu
    const totalRevenue = bills.reduce((sum, bill) => sum + (bill.tongTien || 0), 0);

    res.render('dashboard', {
      roomTypeCount,
      roomCount,
      pendingBookingCount,
      bookedRoomCount,
      availableRoomCount,
      ratingCount,
      registeredCustomers,
      feedbackCustomer,
      cancelledRooms,
      totalRevenue
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.render('dashboard', {
      roomTypeCount: 0,
      roomCount: 0,
      pendingBookingCount: 0,
      bookedRoomCount: 0,
      availableRoomCount: 0,
      ratingCount: 0,
      registeredCustomers: 0,
      feedbackCustomer: 0,
      cancelledRooms: 0,
      totalRevenue: 0
    });
  }
});

// Booking views
router.get('/introduce', (req, res) => res.render('introduce'));
router.get('/bookingroom', (req, res) => res.render('bookingroom'));
router.get('/confirmpayment', (req, res) => res.render('confirmpayment'));
router.get('/newbookingroom', (req, res) => res.render('newbookingroom'));
router.get('/historybooking', (req, res) => res.render('historybooking'));
router.get('/customer_booking', (req, res) => res.render('customer_booking'));

// Room views
const roomRouter = require('./room');
//app.use('/room', roomRouter); 
// router.get('/room', (req, res) => res.render('room'));
router.get('/room_detail', (req, res) => res.render('room_detail'));

router.get('/error', (req, res) => res.render('error', { title: 'Lỗi' }));
router.get('/success', (req, res) => res.render('success', { title: 'Thành công' }));

module.exports = router;
