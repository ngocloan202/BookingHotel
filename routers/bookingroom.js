const express = require('express'); 
const router = express.Router(); 
const Room = require('../models/room'); 
const Nationality = require('../models/national');
const Customer = require('../models/customer');

router.get('/:roomId', async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    const nationalities = await Nationality.find({}).lean();
    console.log('req.user:', req.user);
    let customer = null;
    if (req.session.user) {
       customer = await Customer.findOne({ user: req.session.user._id })
       .populate('nationality').lean();
    }
    if (!room) {
      return res.status(404).send('Phòng không tồn tại');
    }
    res.render('bookingroom', { room, nationalities, customer });
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi server');
  }
});

module.exports = router; 