var express = require ( 'express' ) ;
const session = require('express-session');
const path = require('path');
var app = express () ;
var mongoose = require('mongoose');
//Import router
var indexRouter = require('./routers/index'); 
var roomRouter = require('./routers/room');
const contactRouter = require('./routers/contact');
const router = express.Router();

// Static folder
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session config
app.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: true
}));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Add session to res.locals
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

var uri = 'mongodb+srv://oanhdth225720:%23oanh%23%2A%2A%2A@cluster0.ct8fl.mongodb.net/hotel'; 
mongoose.connect(uri).catch(err => console.log(err)); 

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

app.set('views', './views'); 
app.set('view engine', 'ejs'); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use('/', indexRouter); 
app.use('/room', roomRouter);
app.use('/contact', contactRouter);

app.listen (3000, () => {
console.log ('Server is running at http://127.0.0.1:3000');
});