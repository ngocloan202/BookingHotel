const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//const Room = mongoose.model('Room');
const Room = require('../models/room'); // 
const RoomType = mongoose.model('RoomTypeModel');

router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({})
      .populate('loaiPhong')
      .lean();
    
    rooms.forEach(room => {
      console.log(`Room ${room.tenPhong}:`, {
        roomId: room._id,
        loaiPhong: room.loaiPhong?._id,
        tenLoaiPhong: room.loaiPhong
      });
    });
    
    const processedRooms = rooms.map(room => {
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

// Route chi tiết phòng - FIXED
router.get('/:id', async (req, res) => {
  try {
    const roomId = req.params.id;
    
    // Kiểm tra ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      console.log('Invalid room ID:', roomId);
      return res.status(400).render('room_detail', { 
        room: null, 
        error: 'ID phòng không hợp lệ' 
      });
    }

    console.log('Looking for room with ID:', roomId);
    
    const room = await Room.findById(roomId)
      .populate('loaiPhong')
      .lean();
      
    console.log('Found room:', room);
    
    if (!room) {
      console.log('Room not found for ID:', roomId);
      return res.status(404).render('room_detail', { 
        room: null, 
        error: 'Không tìm thấy phòng' 
      });
    }
    
    // Xử lý dữ liệu phòng để đảm bảo có đầy đủ thông tin
    const processedRoom = {
      ...room,
      image: room.image || 'default.jpg',
      loaiPhong: room.loaiPhong || {
        tenLoaiPhong: 'Chưa xác định',
        moTa: '',
        soNguoiToiDa: 0
      }
    };
    
    res.render('room_detail', { room: processedRoom });
    
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết phòng:', error);
    res.status(500).render('room_detail', { 
      room: null, 
      error: 'Lỗi server: ' + error.message 
    });
  }
});
  // Xoá phòng
router.post('/delete/:id', async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.redirect('/manageroom');
  } catch (err) {
    console.error('Lỗi xoá phòng:', err);
    res.redirect('/manageroom');
  }
});


module.exports = router;