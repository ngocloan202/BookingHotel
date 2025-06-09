const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Room = require('../models/room');
const RoomType = mongoose.model('RoomTypeModel');
const RoomEquipment = mongoose.model('RoomEquipmentModel');
const Equipment = mongoose.model('EquipmentModel');

router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({})
      .populate('loaiPhong')
      .lean();
    
    // Lấy danh sách thiết bị cho từng phòng
    const roomIds = rooms.map(r => r._id);
    const roomEquipments = await RoomEquipment.find({ room: { $in: roomIds }, trangThai: true })
      .populate('equipment')
      .lean();
    
    // Gom thiết bị theo phòng
    const equipmentMap = {};
    roomEquipments.forEach(re => {
      if (!equipmentMap[re.room.toString()]) equipmentMap[re.room.toString()] = [];
      if (re.equipment) equipmentMap[re.room.toString()].push(re.equipment);
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
        },
        equipments: equipmentMap[room._id.toString()] || []
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