var express = require ( 'express' ) ;
var app = express () ;
var mongoose = require('mongoose');
var indexRouter = require('./routers/index'); 
var roomRouter = require('./routers/room');
const contactRouter = require('./routers/contact');
app.use(express.static('public'));

var uri = 'mongodb+srv://loandth225685:Ngocloan2512@cluster0.orj8j.mongodb.net/hotel'; 
mongoose.connect(uri).catch(err => console.log(err)); 

app.set('views', './views'); 
app.set('view engine', 'ejs'); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter); 
app.use('/room', roomRouter);
app.use('/contact', contactRouter);

app.listen (3000, () => {
console.log ('Server is running at http://127.0.0.1:3000');
});