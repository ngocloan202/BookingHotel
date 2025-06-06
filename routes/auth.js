const express = require('express');
const router = express.Router();

// GET /login
router.get('/login', (req, res) => {
    res.render('login', {
        path: '/login',
        user: req.user
    });
});

// POST /login
router.post('/login', async (req, res) => {
    // Xử lý đăng nhập ở đây
});

module.exports = router; 