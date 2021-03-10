var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promotionRouter');
var uploadRouter = require('./routes/uploadRouter');
var favRouter = require('./routes/favoriteRouter');

const mongoose = require('mongoose');

// const Dishes = require('./models/dishes');

const url = config.mongoUrl;

const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('Connected to server');

}, (err) => {
  console.log(err);
})

var app = express();

app.all('*', (req, res, next) => {
  if(req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://'+ req.hostname + ':' + app.get('secPort')+ req.url);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//signed cookie parser with secret key
//app.use(cookieParser('12345-67890-09876-54321'));

//using session instead of cookies
// app.use(session({
//   name:'session-id',
//   secret: '12345-67890-09876-54321',
//   saveUninitialized: false,
//   resave: false,
//   store: new FileStore()
// }));

//calling passport and passport session

app.use(passport.initialize());
// app.use(passport.session());

//Basic Authentication
app.use('/', indexRouter);
app.use('/users', usersRouter);

//removing auth function because only some routes require authentication
// function auth(req, res, next) {
  // console.log(req.headers);
  // console.log(req.signedCookies);
  // console.log(req.session);  
  

  //check point for authenticating user with help of signed cookies or session
  // if (!req.signedCookies.user) {
  // if (!req.user) {
    // var authHeader = req.headers.authorization;

    // if (!authHeader) {
      // var err = new Error('You are not authorized!');
      // res.setHeader('WWW-Authenticate', 'Basic');
      // err.status = 403;
      // return next(err);
    // }

    // var auth = new Buffer.from(authHeader.split(' ')[1], 'base64')
    //   .toString().split(':');

    // var username = auth[0];
    // var password = auth[1];

    // if (username === 'admin' && password === 'password') {
    //   //adding cookies to each of the request after basic authentication
    //   // res.cookie('user', 'admin', {signed: true});
    //   req.session.user = 'admin';
    //   next();
    // }
    // else {
    //   var err = new Error('You are not authorized!');
    //   res.setHeader('WWW-Authenticate', 'Basic');
    //   err.status = 401;
    //   return next(err);
    // }
  // }

  // else {
    // if(req.session.user === 'admin') {
    // if(req.session.user === 'authenticated') {
      // next();
    // }
    // else {
    //   var err = new Error('You are not authorized!');
      
    //   err.status = 401;
    //   next(err);
    // }
//   }
// }

// app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorites', favRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
