var express = require('express');
var router = express.Router();
var room = require('../models/room');

// GET /room/
router.get('/', async (req, res) => {
  var r = await room.find();
  res.render('room', { title: 'Danh sách phòng',  room: r });
});

module.exports = router;