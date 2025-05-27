var express = require('express');
var router = express.Router();

// GET /room/
router.get('/', async (req, res) => {
  res.render('room', { title: 'Danh sách phòng' });
});

module.exports = router;