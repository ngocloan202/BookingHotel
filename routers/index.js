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
const Customer = require('../models/customer');
const Booking = require('../models/booking');
const Review = require('../models/review');
const Bill = require('../models/bill');
const Contact = require('../models/contact');
const Equipment = require('../models/equipment');
const Room_Equipment = require('../models/room_equipment');

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

// Hiển thị danh sách đơn chờ xác nhận
router.get('/newbookingroom', async (req, res) => {
  try {
    const bookings = await Booking.find({ trangThai: 'Chờ xác nhận' })
      .populate('customer')  
      .populate('room');    
    res.render('newbookingroom', { bookings });
  } catch (err) {
    console.error(err);
    res.render('newbookingroom', { bookings: [] });
  }
});

router.post('/confirm-booking/:id', async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { trangThai: 'Đã xác nhận' });
    req.flash('success_msg', 'Đơn đã được xác nhận thành công!');
  } catch (err) {
    req.flash('error_msg', 'Xác nhận thất bại!');
  }
  res.redirect('/newbookingroom');
});
router.post('/cancel-booking/:id', async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { trangThai: 'Đã huỷ đơn' });
    req.flash('success_msg', 'Đơn đã bị huỷ thành công!');
  } catch (err) {
    req.flash('error_msg', 'Huỷ đơn thất bại!');
  }
  res.redirect('/newbookingroom');
});


// Quản lý khách hàng 
router.get('/managecustomer', async (req, res) => {
  try {
    const customers = await Customer.find().lean(); 
    res.render('managecustomer', { customers });
  } catch (err) {
    console.error('Lỗi khi lấy danh sách khách hàng:', err);
    res.render('managecustomer', { customers: [] });
  }
});

//Quản lý phòng
router.get('/manageroom', async (req, res) => {
  try {
    const rooms = await Room.find().populate('loaiPhong').lean();
    rooms.forEach(r => {
      if (!r.image) r.image = 'default.jpg';
    });
    res.render('manageroom', { rooms });
  } catch (err) {
    console.error('Lỗi khi load phòng:', err);
    res.render('manageroom', { rooms: [] });
  }
});
// Hiển thị form thêm phòng
router.get('/rooms/add', async (req, res) => {
  try {
    const roomTypes = await RoomType.find().lean();
    res.render('addroom', { roomTypes });
  } catch (err) {
    console.error('Lỗi khi lấy loại phòng:', err);
    res.redirect('/manageroom');
  }
});

router.post('/rooms/add', upload.single('anhPhong'), async (req, res) => {
  try {
    const { tenPhong, loaiPhong, trangThai, ghiChu } = req.body;
    const roomType = await RoomType.findById(loaiPhong);

    const giaPhong = roomType?.donGia || 0;

    const newRoom = new Room({
      tenPhong,
      image: req.file?.filename || 'default.jpg',
      loaiPhong,
      giaPhong,
      trangThai,
      ghiChu
    });

    await newRoom.save();
    res.redirect('/manageroom');
  } catch (err) {
    console.error('Lỗi khi thêm phòng:', err);
    res.redirect('/rooms/add');
  }
});

router.get('/rooms/edit/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).lean();
    const roomTypes = await RoomType.find().lean();

    res.render('editroom', { room, roomTypes });
  } catch (err) {
    console.error('Lỗi khi load form sửa phòng:', err);
    res.redirect('/manageroom');
  }
});

router.post('/rooms/edit/:id', upload.single('anhPhong'), async (req, res) => {
  try {
    const { tenPhong, loaiPhong, trangThai, ghiChu } = req.body;
    const roomType = await RoomType.findById(loaiPhong);
    const giaPhong = roomType?.donGia || 0;

    const updateData = {
      tenPhong,
      loaiPhong,
      trangThai,
      ghiChu,
      giaPhong
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    await Room.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/manageroom');
  } catch (err) {
    console.error('Lỗi khi sửa phòng:', err);
    res.redirect('/manageroom');
  }
});

//lịch sử đặt phòng
router.get('/historybooking', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('customer')
      .populate('room')
      .lean();

    res.render('historybooking', { bookings });
  } catch (err) {
    console.error('Lỗi khi lấy lịch sử đặt phòng:', err);
    res.render('historybooking', { bookings: [] });
  }
});

//xác nhận thanh toán
router.get('/confirmpayment', async (req, res) => {
  try {
    const bookings = await Booking.find({ trangThai: 'Đã xác nhận' })
      .populate('customer')
      .populate('room')
      .lean();

    res.render('confirmpayment', { bookings });
  } catch (err) {
    console.error('Lỗi hiển thị thanh toán:', err);
    res.render('confirmpayment', { bookings: [] });
  }
});
router.post('/payment/confirm/:id', async (req, res) => {
    try {
      // Cập nhật trạng thái đơn đặt phòng
      const updatedBooking = await Booking.findByIdAndUpdate(
        req.params.id,
        { trangThai: 'Đã thanh toán' },
        { new: true } // để lấy booking sau khi update
      );
  
      // Cập nhật trạng thái phòng thành 'Trống'
      if (updatedBooking && updatedBooking.room) {
        await Room.findByIdAndUpdate(updatedBooking.room, { trangThai: 'Trống' });
      }
    req.flash('success_msg', 'Xác nhận thanh toán thành công!');
  } catch (err) {
    console.error('Lỗi xác nhận thanh toán:', err);
    req.flash('error_msg', 'Xác nhận thất bại!');
  }
  res.redirect('/confirmpayment');
});

router.post('/payment/cancel/:id', async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { trangThai: 'Đã huỷ đơn' });
    req.flash('success_msg', 'Đơn đã được huỷ!');
  } catch (err) {
    console.error('Lỗi huỷ:', err);
    req.flash('error_msg', 'Huỷ thất bại!');
  }
  res.redirect('/confirmpayment');
});

//xử lý đánh giá
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('customer')
      .populate('room')
      .sort({ ngay: -1 })
      .lean();
    res.render('reviews', { reviews });
  } catch (err) {
    console.error('Lỗi hiển thị đánh giá:', err);
    res.render('reviews', { reviews: [] });
  }
});

router.post('/reviews/delete/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Xoá đánh giá thành công!');
  } catch (err) {
    console.error('Lỗi xoá đánh giá:', err);
    req.flash('error_msg', 'Xoá đánh giá thất bại!');
  }
  res.redirect('/reviews');
});

router.post('/reviews/read/:id', async (req, res) => {
  try {
    await Review.findByIdAndUpdate(req.params.id, { hienThi: false });
    req.flash('success_msg', 'Đánh dấu đã đọc thành công!');
  } catch (err) {
    req.flash('error_msg', 'Lỗi khi đánh dấu đã đọc!');
  }
  res.redirect('/reviews');
});

router.post('/reviews/read-all', async (req, res) => {
  try {
    await Review.updateMany({}, { hienThi: false });
    req.flash('success_msg', 'Tất cả đánh giá đã được đánh dấu là đã đọc.');
  } catch (err) {
    req.flash('error_msg', 'Lỗi khi đánh dấu tất cả.');
  }
  res.redirect('/reviews');
});

router.post('/reviews/delete-all', async (req, res) => {
  try {
    await Review.deleteMany({});
    req.flash('success_msg', 'Tất cả đánh giá đã được xoá.');
  } catch (err) {
    req.flash('error_msg', 'Lỗi khi xoá tất cả.');
  }
  res.redirect('/reviews');
});

//feedback khách hàng
router.get('/feedback', async (req, res) => {
  try {
    const feedbacks = await Contact.find().sort({ createdAt: -1 }).lean();
    res.render('feedback', { feedbacks });
  } catch (err) {
    console.error('Lỗi khi load phản hồi:', err);
    res.render('feedback', { feedbacks: [] });
  }
});

router.post('/feedback/delete/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Xoá phản hồi thành công!');
  } catch (err) {
    console.error('Lỗi xoá phản hồi:', err);
    req.flash('error_msg', 'Xoá phản hồi thất bại!');
  }
  res.redirect('/feedback');
});

router.get('/manageequipment', async (req, res) => {
  try {
    const equipments = await Equipment.find().lean();
    const roomEquipments = await Room_Equipment.find()
      .populate('room')
      .populate('equipment')
      .lean();

    res.render('manageequipment', {
      equipments,
      roomEquipments,
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  } catch (err) {
    console.error('Lỗi khi load thiết bị:', err);
    res.render('manageequipment', {
      equipments: [],
      roomEquipments: [],
      success_msg: [],
      error_msg: ['Không thể tải dữ liệu thiết bị']
    });
  }
});

// Hiển thị form thêm thiết bị
router.get('/equipment/add', (req, res) => {
  res.render('addequipment');
});

// Xử lý thêm thiết bị
router.post('/equipment/add', async (req, res) => {
  try {
    const { tenThietBi, donGia, moTa } = req.body;
    const newEquipment = new Equipment({ tenThietBi, donGia, moTa });
    await newEquipment.save();
    req.flash('success_msg', 'Thêm thiết bị thành công!');
    res.redirect('/manageequipment');
  } catch (err) {
    console.error('Lỗi thêm thiết bị:', err);
    req.flash('error_msg', 'Thêm thiết bị thất bại!');
    res.redirect('/manageequipment');
  }
});

// Hiển thị form sửa thiết bị
router.get('/equipment/edit/:id', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id).lean();
    res.render('editequipment', { equipment });
  } catch (err) {
    console.error('Lỗi hiển thị form sửa thiết bị:', err);
    res.redirect('/manageequipment');
  }
});

// Xử lý cập nhật thiết bị
router.post('/equipment/edit/:id', async (req, res) => {
  try {
    const { tenThietBi, donGia, moTa } = req.body;
    await Equipment.findByIdAndUpdate(req.params.id, { tenThietBi, donGia, moTa });
    req.flash('success_msg', 'Cập nhật thiết bị thành công!');
    res.redirect('/manageequipment');
  } catch (err) {
    console.error('Lỗi cập nhật thiết bị:', err);
    req.flash('error_msg', 'Cập nhật thất bại!');
    res.redirect('/manageequipment');
  }
});

// Xử lý xoá thiết bị
router.post('/equipment/delete/:id', async (req, res) => {
  try {
    await Equipment.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Xoá thiết bị thành công!');
  } catch (err) {
    console.error('Lỗi xoá thiết bị:', err);
    req.flash('error_msg', 'Xoá thất bại!');
  }
  res.redirect('/manageequipment');
});

// Hiển thị form thêm thiết bị vào phòng
router.get('/room-equipment/add', async (req, res) => {
  try {
    const rooms = await Room.find().lean();
    const equipments = await Equipment.find().lean();
    res.render('addroomequipment', { rooms, equipments });
  } catch (err) {
    console.error('Lỗi load form thêm room-equipment:', err);
    res.redirect('/manageequipment');
  }
});

// Xử lý thêm room-equipment
router.post('/room-equipment/add', async (req, res) => {
  try {
    const { room, equipment, trangThai } = req.body;
    const newRE = new Room_Equipment({
      room,
      equipment,
      trangThai: trangThai === 'true'
    });
    await newRE.save();
    req.flash('success_msg', 'Thêm thiết bị vào phòng thành công!');
  } catch (err) {
    console.error('Lỗi thêm room-equipment:', err);
    req.flash('error_msg', 'Thêm thất bại!');
  }
  res.redirect('/manageequipment');
});

// Hiển thị form sửa room-equipment
router.get('/room-equipment/edit/:id', async (req, res) => {
  try {
    const roomEquipment = await Room_Equipment.findById(req.params.id).lean();
    const rooms = await Room.find().lean();
    const equipments = await Equipment.find().lean();
    res.render('editroomequipment', { roomEquipment, rooms, equipments });
  } catch (err) {
    console.error('Lỗi load form sửa room-equipment:', err);
    res.redirect('/manageequipment');
  }
});

// Xử lý cập nhật room-equipment
router.post('/room-equipment/edit/:id', async (req, res) => {
  try {
    const { room, equipment, trangThai } = req.body;
    await Room_Equipment.findByIdAndUpdate(req.params.id, {
      room,
      equipment,
      trangThai: trangThai === 'true'
    });
    req.flash('success_msg', 'Cập nhật thiết bị trong phòng thành công!');
  } catch (err) {
    console.error('Lỗi cập nhật room-equipment:', err);
    req.flash('error_msg', 'Cập nhật thất bại!');
  }
  res.redirect('/manageequipment');
});

router.post('/room-equipment/delete/:id', async (req, res) => {
  try {
    await Room_Equipment.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Xoá thiết bị khỏi phòng thành công!');
  } catch (err) {
    console.error('Lỗi xoá room-equipment:', err);
    req.flash('error_msg', 'Xoá thất bại!');
  }
  res.redirect('/manageequipment');
});

// Booking views
router.get('/introduce', (req, res) => res.render('introduce'));
router.get('/bookingroom', (req, res) => res.render('bookingroom'));

//Lịch sử đặt phòng mỗi account
router.get('/customer_booking', async (req, res) => {
  try {
    // Lấy user hiện tại từ session
    const userId = req.session.user._id;

    // Tìm customer tương ứng
    const customer = await Customer.findOne({ user: userId });
    if (!customer) {
      req.flash('error_msg', 'Không tìm thấy thông tin khách hàng');
      return res.redirect('/');
    }

    // Lấy các đơn đặt phòng của customer và populate thông tin phòng
    const bookings = await Booking.find({ customer: customer._id })
      .populate('room')
      .sort({ ngayDat: -1 })
      .lean();

    // Truyền bookings và user sang view
    res.render('customer_booking', {
      bookings,
      user: req.session.user
    });
  } catch (err) {
    console.error('Lỗi khi tải đơn đặt phòng:', err);
    res.render('customer_booking', {
      bookings: [],
      user: req.session.user
    });
  }
});

router.get('/booking/cancel/:id', async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { trangThai: 'Đã hủy đơn' });
    req.flash('success_msg', 'Đơn đặt phòng đã được huỷ!');
  } catch (err) {
    console.error('Lỗi huỷ đặt phòng:', err);
    req.flash('error_msg', 'Không thể huỷ đơn!');
  }
  res.redirect('/customer_booking');
});

router.get('/review/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    res.render('writingreview', { bookingId });
  } catch (err) {
    console.error('Lỗi khi mở form đánh giá:', err);
    res.redirect('/customer_booking');
  }
});

// Gửi đánh giá
router.post('/review/submit', async (req, res) => {
  try {
    const { soSao, noiDung, bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate('customer').populate('room');

    const review = new Review({
      customer: booking.customer._id,
      room: booking.room._id,
      soSao,
      noiDung,
      hienThi: true,
      ngayDanhGia: new Date()
    });

    await review.save();

    req.flash('success_msg', 'Đánh giá đã được gửi!');
    res.redirect('/customer_booking');
  } catch (err) {
    console.error('Lỗi khi gửi đánh giá:', err);
    req.flash('error_msg', 'Gửi đánh giá thất bại!');
    res.redirect('/customer_booking');
  }
});



// Room views
const roomRouter = require('./room');

// router.get('/room', (req, res) => res.render('room'));
router.get('/room_detail', (req, res) => res.render('room_detail'));

router.get('/error', (req, res) => res.render('error', { title: 'Lỗi' }));
router.get('/success', (req, res) => res.render('success', { title: 'Thành công' }));

module.exports = router;
