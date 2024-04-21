require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const flash = require('connect-flash');

const dbURL = process.env.DB_URL;
mongoose.connect(dbURL, () => {
  console.log('Connected to DB');
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash());

app.use(
  require('express-session')({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

const indexRoutes = require('./routes/index');
const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');
const orderRoutes = require('./routes/order');
const searchRoutes = require('./routes/search');

app.use(reviewRoutes);
app.use(orderRoutes);
app.use('/', indexRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/search', searchRoutes);

const PORT = process.env.PORT || 3000; // Heroku assigns PORT via an environment variable

app.listen(port_used, () => {
  console.log('Server started on port ' + port_used);
});
