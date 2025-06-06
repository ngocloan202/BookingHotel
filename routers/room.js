const express = require('express');
const router = express.Router();
const Room = require('../models/room');

// Route hiển thị danh sách phòng
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({})
      .populate('loaiPhong', 'tenLoaiPhong donGia soNguoiToiDa moTa')
      .lean(); 
    
    rooms.forEach((room, index) => {
      console.log(`Phòng ${index + 1}:`, {
        _id: room._id,
        tenPhong: room.tenPhong,
        image: room.image,
        giaPhong: room.giaPhong,
        trangThai: room.trangThai,
        loaiPhong: room.loaiPhong
      });
    });
    
    // Xử lý dữ liệu để đảm bảo có giá trị mặc định
    const processedRooms = rooms.map(room => ({
      ...room,
      image: room.image || 'default.jpg',
      loaiPhong: room.loaiPhong || { tenLoaiPhong: 'Chưa xác định' }
    }));
    
    res.render('room', { 
      rooms: processedRooms,
      title: 'Danh sách phòng'
    });
    
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phòng:', error);
    res.render('room', { 
      rooms: [],
      title: 'Danh sách phòng',
      error: 'Không thể tải danh sách phòng'
    });
  }
});

module.exports = router;