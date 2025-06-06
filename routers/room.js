const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Room = mongoose.model('Room');

// Route hiển thị danh sách phòng
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({})
      .populate({
        path: 'loaiPhong',
        model: 'RoomTypeModel',
        select: 'tenLoaiPhong donGia soNguoiToiDa moTa'
      })
      .lean();
    
    console.log('Fetched rooms:', rooms); // Debug log
    
    // Xử lý dữ liệu để đảm bảo có giá trị mặc định
    const processedRooms = rooms.map(room => {
      console.log('Processing room:', room); // Debug log
      return {
        ...room,
        image: room.image || 'default.jpg',
        loaiPhong: room.loaiPhong || { 
          tenLoaiPhong: 'Chưa xác định',
          donGia: 0,
          soNguoiToiDa: 0,
          moTa: ''
        }
      };
    });
    
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