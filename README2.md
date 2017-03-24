# Project 2: Part 2 Adding User Authentication

## Add in our session route
##### In the terminal
1. `touch routes/sessions.js`
2. `mkdir helpers`
3. `touch helpers/auth.js`

##### In the routes/sessions.js
```
var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var authHelpers = require('../helpers/auth.js');

module.exports = router;
```

##### In the helpers/auth.js
```
var User = require('../models/user.js');
var bcrypt = require('bcrypt');

function createSecure(req, res, next) {
  var password = req.body.password

  res.hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  next()
}

function loginUser(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({ email: email })
  .then(function(foundUser){
    if (foundUser == null) {
      res.json({status: 401, data: "unauthorized"})

    } else if (bcrypt.compareSync(password, foundUser.password_digest)) {
      req.session.currentUser = foundUser;
    }
    next()
  })
  .catch(function(err){
    res.json({status: 500, data: err})
  });
}

function authorize(req, res, next) {
  var currentUser = req.session.currentUser

  // THIS ASSUMES THAT EVERY :id refers to the user _id
  // needs to check if the current user doesn't exist, if it does then make
  // sure that the id of the logged in user and the id of the route match
  if (!currentUser || currentUser._id !== req.params.id ) {
    // customize
    // res.render('errors/401.hbs')
    // res.redirect('/users')
    res.send({status: 401})
  } else {
    next()
  }
};

module.exports = {
  createSecure: createSecure,
  loginUser: loginUser,
  authorize: authorize
}
```
In order to use these files we have created in our app, we need to require them.

##### In the app.js, add:
On line 14, above the var users, add:
`var sessions = require('./routes/sessions');`


```
function hello(req, res, next) {
  console.log('HELLO FROM MIDDLEWARE>>>>>>>>>>>');
  next()
}

app.get('/test-middleware', authHelpers.authorize, function(req, res) {
  res.send('hi')
})
```