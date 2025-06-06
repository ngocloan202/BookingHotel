var express = require('express');
var router = express.Router();
const Room = require('../models/room');

// GET /room/
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find().populate('loaiPhong');
    res.render('room', { rooms:rooms });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;