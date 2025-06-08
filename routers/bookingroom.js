const express = require('express'); 
const router = express.Router(); 
const Room = require('../models/room'); 
const Nationality = require('../models/national');

router.get('/:roomId', async (req, res) => {
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