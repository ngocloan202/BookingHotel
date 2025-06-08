const express = require('express'); 
const router = express.Router(); 
const mongoose = require('mongoose');
const Booking = mongoose.model('BookingModel');
const Room = mongoose.model('Room');
const Customer = mongoose.model('CustomerModel');


router.post('/confirm', async (req, res) => {
  try{
    const { hoVaTen,
      cccd,
      soDienThoai,
      email,
      diaChi,
      nationalityId,
      userId, // nếu có đăng nhập
      roomId,
      ngayNhanPhong,
      ngayTraPhong,
      soNguoiLon,
      soTreEm,} = req.body;
    const checkInDay = new Date(ngayNhanPhong);
    const checkOutDay = new Date(ngayTraPhong);
    
    if(checkOutDay <= checkInDay) {
      return res.status(400).json({error: 'Ngày trả phòng phải sau ngày nhận phòng'});
    }
    let customer = await Customer.findOne({cccd});
    if(!customer) {
        customer = new Customer({
        hoVaTen,
        cccd,
        soDienThoai,
        email,
        diaChi,
        nationality: nationalityId,
      });
      await customer.save();
    };

    const room  = await Room.findById(roomId);
    if(!room) {
      return res.status(404).json({error: 'Phòng không tồn tại'});
    }

    const price = room.giaPhong;
    const NumOfNight = Math.ceil((checkOutDay - checkInDay) / (1000 * 60 * 60 * 24));
    const total = NumOfNight * price;

    const newBooking = new Booking({
     
      customer:  customer._id || null,
      room: roomId,
      user: userId || null,
      ngayNhanPhong: checkInDay,
      ngayTraPhong: checkOutDay,
      soNgayThue: NumOfNight,
      soNguoiLon: soNguoiLon || 1,
      soTreEm: soTreEm || 0,
      tongTien: total,
    });

    await newBooking.save();
    res.redirect(`/booking/confirm/${newBooking._id}`);
  }
  catch (error) {
    console.error(error);
  }
});

router.get('/confirm/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
    .populate('room').populate('customer')
    .populate('user');
    if (!booking) {
      return res.status(404).send('Lỗi');
    }
    res.render('bookingConfirm', { booking });
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi server');
  }
});
module.exports = router; 