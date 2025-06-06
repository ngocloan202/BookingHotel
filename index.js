const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Session config
app.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Add session to res.locals
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Routes
const roomRoutes = require('./routes/room');
const authRoutes = require('./routes/auth');
const indexRouter = require('./routers/index');
const contactRouter = require('./routers/contact');

app.use('/room', roomRoutes);
app.use('/', authRoutes);
app.use('/', indexRouter);
app.use('/contact', contactRouter);

// Home page
app.get('/', (req, res) => {
    res.render('index', {
        path: '/',
        user: req.user
    });
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://oanhdth225720:%23oanh%23%2A%2A%2A@cluster0.ct8fl.mongodb.net/hotel')
    .then(() => {
        console.log('Connected to MongoDB');
        // Start server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });