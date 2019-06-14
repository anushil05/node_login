const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

// passport configuration
require('./config/passport')(passport);

// db configuration
const db = require('./config/keys').MongoURI;

// Connect to Mongo using mongoose, returns a Promise
mongoose.connect(db, {useNewUrlParser: true})
    .then(() => console.log('mongodb is now connected...'))
    .catch(err => console.log(err));

// EJS Middleware
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// BodyParser
app.use(express.urlencoded({extended: false}));


//Routes 
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server Started on port ${PORT}`));