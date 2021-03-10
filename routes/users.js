var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
var router = express.Router();
var cors = require('./cors');
router.use(bodyParser.json());

router.options('*', cors.corsWithOptions, (req, res) => {
  res.sendStatus(200);
});

/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  // res.send('respond with a resource');
  User.find({})
    .then((users) => {
      if (users) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
      }
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.post('/signup', cors.corsWithOptions, (req, res, next) => {
  // User.findOne({username: req.body.username})
  //using register method for passport
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'applicaation/json');
      res.json({ err: err });
    }
    else {
      //adding first name and last name of user to db
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({ err: err });
          return;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, status: 'Registration Successful!' });
        });
      });
    }
  });
  // if(user != null) {  
  //   var err = new Error('User ' + req.body.username + ' already exists!');
  //   err.status = 403;
  //   next(err);
  // }
  // else {
  //   return User.create({
  //     username: req.body.username,
  //     password: req.body.password
  //   });
  // }
  // .then((user) => {
  //   if(user != null) {  
  //     var err = new Error('User ' + req.body.username + ' already exists!');
  //     err.status = 403;
  //     next(err);
  //   }
  //   else {
  //     return User.create({
  //       username: req.body.username,
  //       password: req.body.password
  //     });
  //   }
  // })
  // .then((user) => {
  //   res.statusCode = 200;
  //   res.setHeader('Content-Type','application/json');
  //   res.json({status: 'Registration Successful!', user: user});
  // }, (err) => next(err))
  // .catch(err => next(err));
});

router.post('/login', cors.corsWithOptions, (req, res, next) => {

  //added passport local inside the method to provide additional 
  //info to the client side
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: false, status: 'Login Unsuccessful!', err: info });
    }

    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: false, status: 'Login Unsuccessful!', err: 'Could not login the user!' });
      }

      //creating a token
      var token = authenticate.getToken({ _id: req.user._id });

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: true, token: token, status: 'Login Successful!' });
    });

  })(req, res, next);


  // if (!req.session.user) {
  //   var authHeader = req.headers.authorization;

  //   if (!authHeader) {
  //     var err = new Error('You are not authorized!');
  //     res.setHeader('WWW-Authenticate', 'Basic');
  //     err.status = 401;
  //     return next(err);
  //   }

  //   var auth = new Buffer.from(authHeader.split(' ')[1], 'base64')
  //     .toString().split(':');

  //   var username = auth[0];
  //   var password = auth[1];

  //   User.findOne({username: username})
  //   .then((user) => {
  //     if(user === null){
  //       var err = new Error('User '+ username +' does not exist');
  //       err.status = 403;
  //       return next(err);
  //     }

  //     else if(user.password !== password){
  //       var err = new Error('Your password is incorrect');
  //       err.status = 403;
  //       return next(err);
  //     }
  //     else if (user.username === username && user.password === password) {
  //       //adding cookies to each of the request after basic authentication
  //       // res.cookie('user', 'admin', {signed: true});
  //       req.session.user = 'authenticated';
  //       res.statusCode = 200;
  //       res.setHeader('Content-Type','text/plain');
  //       res.end('You are Authenticated!');
  //     }
  //   })
  //   .catch((err) => next(err));
  // }

  // else {
  //   res.statusCode = 200;
  //   res.contentType('Content-Type','text/plain');
  //   res.end('You are already authenticated');
  // }
})

router.get('/logout', cors.corsWithOptions, (req, res) => {
  if (req.session) {
    req.session.destroy();
    // res.clearCookie('session-id');
    res.clearCookie('session-id', {httpOnly:true, path:"/"});
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, status: 'Login Successful!' });
  }
})

router.get('/checkJWTToken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err)
      return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({ status: 'JWT Invalid!', success: false, err: info });
    }

    else {
      
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ status: 'JWT Valid!', success: true, user: user });
    }
  })(req, res);
})

module.exports = router;
