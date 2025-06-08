const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Static folder
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session config
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Add session to res.locals
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Tải tất cả các model để MongoDB tạo collection tương ứng
require('./models/bill');
require('./models/booking');
require('./models/customer');
require('./models/equipment');
require('./models/national');
require('./models/review');
require('./models/room');
require('./models/room_equipment');
require('./models/roomtype');
require('./models/service');
require('./models/serviceuse');
require('./models/user');

// Import routers
const indexRouter = require('./routers/index');
const roomRouter = require('./routers/room');
const contactRouter = require('./routers/contact');
const bookingRouter = require('./routers/booking');
const bookingConfirmRouter = require('./routers/bookingConfirm');

// Use routers
app.use('/', indexRouter);
app.use('/room', roomRouter);
app.use('/contact', contactRouter);
app.use('/booking', bookingRouter);
app.use('/booking', bookingConfirmRouter);

// Connect to MongoDB
const uri = 'mongodb+srv://oanhdth225720:%23oanh%23%2A%2A%2A@cluster0.ct8fl.mongodb.net/hotel';
mongoose.connect(uri)
    .then(() => {
        console.log('Connected to MongoDB');
        // Start server
        app.listen(3000, () => {
            console.log('Server is running at http://127.0.0.1:3000');
        });
    })
    .catch(err => console.log(err));