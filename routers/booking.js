const express = require('express'); 
const router = express.Router(); 
const mongoose = require('mongoose');
const Room = mongoose.model('Room');
const Nationality = mongoose.model('NationalityModel');

router.get('/confirm-room/:roomId', async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    const nationalities = await Nationality.find({}).lean();

    if (!room) {
      return res.status(404).send('Phòng không tồn tại');
    }
    res.render('bookingroom', { room, nationalities });
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi server');
  }
});

module.exports = router; 