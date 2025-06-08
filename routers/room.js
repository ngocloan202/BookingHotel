const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Room = mongoose.model('Room');

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

router.get('/:id', async (req, res) => {
  try {
    const roomId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).render('room_detail', { 
        room: null, 
        error: 'ID phòng không hợp lệ' 
      });
    }
    
    const room = await Room.findById(roomId)
      .populate('loaiPhong')
      .lean();
          
    if (!room) {
      return res.status(404).render('room_detail', { 
        room: null, 
        error: 'Không tìm thấy phòng' 
      });
    }
    
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

module.exports = router;