# Project 2

## What's our app?
* We want to create an app to keep track of our favorite books and authors, so that we can easily recommend them to friends.

<br />

## Basic Pseudocode
#### What do we need to do?
* We need to create an author model, with an embedded book document.
* We need to create some seed data for our authors and their books.
* We would like to create index, show, edit, new, update, delete routes for our authors.
	* Create an author controller/route
	* Create a views/authors folder in which to add our views 



#### What we need to install/tools
As this is a MEN stack app, we have a few node packages that we need to install.

##### npm packages
* bcrypt
* express/express generator
	* `express --view=hbs --git myapp_name`
	* https://expressjs.com/en/starter/generator.html
* mongoose
* hbs
* method-override
* morgan
* body-parser

##### other tools of the trade
* bootstrap
* jquery
* heroku

<br />

## ERDs
#### BookSchema
     title: String
     publication_year: String
#### AuthorSchema
     first_name: String
     last_name: String
     country: String
     books: [BookSchema]

<br />

## Set up
##### From your ga/projects folder:
1. run `express --view=hbs --git project_2`
2. cd into project_2
3. npm install
	* packages installed automatically:
		* body-parser
		* cookie-parser
		* debug
		* express
		* hbs
		* morgan
		* serve-favicon
		
##### We are still missing a few npm packages that we need
1. `npm install --save mongoose` <br />
2. `npm install --save method-override`

##### We know that when we npm install something, we need to require it.
1. subl .
1. In our app.js, underneath the `var express`, add:
	* `var mongoose = require('mongoose');`
2. Underneath the `var bodyParser`, add:
	* `var methodOverride = require('method-override');`
3. To give us access to method override, underneath the `app.use(express.static...`, around line 26 add:
	* `app.use(methodOverride('_method'));`
4. In the terminal, type `npm start`

##### Express generator
Like Danny stated yesterday, the express generator gives us a lot.

	* app.js
	* routes folder- where we put our controllers
		* index.js
		* users.js
	* views folder- where we put our views
		* layout.hbs
		* error.hbs
		* index.hbs 
	* public folder- where we put our assets
		* images folder
		* javascript folder
		* css folder
	* bin folder
		* www - provides the set up for our app 

This is a great start!  But there are still a few things that we need to add.


##### Back to the set up
1. mkdir models
2. `touch db.js seeds.js models/author.js routes/authors.js

<br />

#### Back to the app: Setting up the Database
##### In the db.js, add:
```
var mongoose = require('mongoose');

var db = mongoose.connection;

mongoose.promise = global.Promise;

// CONNECTION EVENTS
db.once('open', function() {
  console.log("Opened mongoose.");
});
db.once('close', function() {
  console.log("Closed mongoose.");
});
db.on('connected', function() {
  console.log('Mongoose connected to ' + db.host + ':' + db.port + '/' + db.name);
});
db.on('error', function(err) {
  console.log('Mongoose connection error: ' + err);
});
db.on('disconnected', function() {
  console.log('Mongoose disconnected');
});

module.exports = db;
```

##### In the app.js
Underneath the `var methodOverride`, add:

```
var db = require('./db');

mongoose.connect('mongodb://localhost/project-2');
```

1. In the terminal, type `npm start`
2. If you open localhost:3000, do you see the basic express app view?

<br />

#### Setting up the author model
##### In the models/author.js, add:
```
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.promise = global.Promise;

var BookSchema = new Schema({
    title: String,
    publication_year: String
});

var AuthorSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    country: String,
    books: [BookSchema]
});

AuthorSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

AuthorSchema.virtual('fullName').get(function() {
  return this.first_name + ' ' + this.last_name;
});

module.exports = mongoose.model("Author", AuthorSchema); 

```

1. Virtual attributes allow you to create data that will not be persisted to the database.
2. Read more about [virtual attributes](http://mongoosejs.com/docs/guide.html)

<br />

#### Setting up the author controller/route for the index
##### In the routes/authors.js
```
var express = require('express');
var router = express.Router();

var Author = require('../models/author');

// index authors
router.get('/', function(req, res) {
    res.send('authors will be here');
});

module.exports = router;
```
1. Just like with a controller, if we add another route, we have to set it up in our `app.js`, add:
	* around line 15, under your other routes, add: `var authors = require('./routes/authors');`
	* around line 24, under your other app.use, add: `app.use('/authors', authors);`
2. Close your npm start/restart- `control + c`, then `npm start`
3. Check out the results in postman at localhost:3000/authors
![authors index set up](https://i.imgur.com/cWvkgvh.png)

<br />

#### Setting up the author seeds
##### In the seeds.js, add:
```
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/project-2');

var Author = require("./models/author");

mongoose.promise = global.Promise;

Author.remove({}, function(err) {
    console.log(err);
});

var saintExupery = new Author({
    first_name: 'Antoine',
    last_name: 'de Saint-Exupery',
    country: 'France',
    books: [{title: 'The Little Prince', publication_year: '1943'}]
});

var fforde = new Author({
    first_name: 'Jasper',
    last_name: 'Fforde',
    country: 'England',
    books: [{title: 'The Eyre Affair', publication_year: '2001'}]
});

var willig = new Author({
    first_name: 'Lauren',
    last_name: 'Willig',
    country: 'United States',
    books: [{title: 'The Secret History of the Pink Carnation', publication_year: '2000'}]
});

var lutz = new Author({
    first_name: 'Lisa',
    last_name: 'Lutz',
    country: 'Unites States',
    books: [{title: 'The Spellman Files: A Novel', publication_year: '2007'}]
});


saintExupery.save(function(err) {
  if (err) console.log(err);

  console.log('de Saint-Exupery created!');
});

fforde.save(function(err) {
  if (err) console.log(err);

  console.log('Fforde created!');
});

willig.save(function(err) {
  if (err) console.log(err);

  console.log('Willig created!');
});

lutz.save(function(err) {
  if (err) console.log(err);

  console.log('Lutz created!');
});
```
1. in another terminal tab, run `node seeds.js`

##### You should see this response in your terminal:

```
Fforde created!
de Saint-Exupery created!
Lutz created!
Willig created! 
```
Hooray! We now have some seeds of my favorite author!

<br />

#### Setting up the author's index view to show our data 
##### In the terminal:
1. `mkdir views/authors`
2. `touch views/authors/index.hbs`

##### In our views/authors/index.hbs:
```
<h1>My Favorite Authors</h1>
```

##### In our routes/authors.js:
```
var express = require('express');
var router = express.Router();

var Author = require('../models/author');

// index authors
router.get('/', function(req, res) {
    // res.send('authors will be here');
    Author.find({})
        .exec(function(err, authors) {
            if(err) console.log(err);

            console.log(authors);
            res.send(authors);
        });
});

module.exports = router;
```
1. restart npm- `control + c`, then `npm start`
2. Open postman and check that this works at localhost:3000/authors

![authors index in postman](https://i.imgur.com/ARfAlzH.png)




