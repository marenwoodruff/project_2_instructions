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
On line 14, above the var index, add:
`var authHelpers = require('./helpers/auth.js');`

On line 16, above the var users, add:
`var sessions = require('./routes/sessions');`

On line 43, above the app.use('/users..., add:
`app.use('/sessions', sessions);`

On line 47, above the catch 404, add:

```
function hello(req, res, next) {
  console.log('HELLO FROM MIDDLEWARE>>>>>>>>>>>');
  next()
}

app.get('/test-middleware', authHelpers.authorize, function(req, res) {
  res.send('hi')
})
```

##### In the terminal
1. `touch models/user.js`

##### In the model/user.js
```
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

var UserSchema = new Schema({
  email: String,
  password_digest: String,
  created_at: Date,
  updated_at: Date
});

UserSchema.pre('save', function(next) {
  now = new Date();
  this.updated_at = now;

  if (!this.created_at) { this.created_at = now }
  next()
});

module.exports = mongoose.model('User', UserSchema);
```

##### In the terminal, add:
1. `mkdir views/users`
2. `touch views/users/index.hbs`

##### In the routes/users.js, add in your routes
```
var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var authHelpers = require('../helpers/auth.js');

// users index
router.get('/', function(req, res) {
  console.log(req.session)
  User.find({})
  .exec(function(err, users){
    if (err) { console.log(err); }
    res.render('users/index.hbs', {
      users: users,
      currentUser: req.session.currentUser
    });
  });
});

// user signup
router.get('/signup', function(req, res){
  res.render('users/signup.hbs')
});

// user show
router.get('/:id', authHelpers.authorize, function(req, res) {
  User.findById(req.params.id)
  .exec(function(err, user) {
    if (err) console.log(err);
    console.log(user);
    // res.render('user/show.hbs', { user: user } );
    res.render('users/show.hbs', { user } );
  });
});

// create user
router.post('/', authHelpers.createSecure, function(req, res){
  var user = new User({
    email: req.body.email,
    password_digest: res.hashedPassword
  });

  user.save(function(err, user){
    if (err) console.log(err);

    console.log(user);
    res.redirect('/users');
  });
});

module.exports = router;
```


##### In the routes/sessions.js, add in your routes
```
router.get('/login', function(req, res) {
  res.render('users/login.hbs')
})

router.post('/login', authHelpers.loginUser, function(req, res){
  console.log(req.session)
  res.redirect('/users')
});

router.delete('/', function(req, res){
  req.session.destroy(function() {
    res.redirect('/users')
  })
})
```