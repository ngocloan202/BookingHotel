const express = require('express');
const router = express.Router();

// GET /room
router.get('/', async (req, res) => {
    try {
        res.render('room', {
            path: '/room',
            user: req.user // nếu bạn đang sử dụng authentication
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router; 