# Project 2

## What's our app?
Our goal this morning is to create an app to keep track of our favorite books and authors, so that we can easily recommend them to friends.

<br />

## User Stories/Wireframes
I didn't create user stories, but this is the time where I normally would.  Frankly, creating this repo took a long time.  So...  I focused on that.

<br />

## Basic Pseudocode
#### What do we need to do?
* We need to create an author model.
* We need to create some seed data for our authors and their books.
* We would like to create index, show, edit, new, update, delete routes for our authors.
	* Create an author controllers/route
	* Create a views/authors folder in which to add our views 

<br />

## ERDs
#### AuthorSchema
     first_name: String
     last_name: String
     country: String
     book_title: String,
     publication_year: String

<br />


## What we need to install/tools
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
* bcrypt
* express-session
* pry

##### other tools of the trade
* bootstrap
* jquery
* heroku

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
3. `npm install --save bcrypt`
4. `npm install --save express-session`
5. `npm install --save pryjs`

##### We know that when we npm install something, we need to require it.
1. subl .
2. In our app.js, at the very top of the page, add:
	* `pry = require('pryjs');`
		* Don't use 'var' 
1. In our app.js, underneath the `var express`, add:
	* `var mongoose = require('mongoose');`
2. Underneath the `var bodyParser`, add:
	* `var session = require('express-session');`<br />
	**&&**
	* `var methodOverride = require('method-override');`
3. To give us access to method override, underneath the `app.use(express.static...`, around line 26 add:
	* `app.use(methodOverride('_method'));`<br />
	**&&**
	
	```
	app.use(session({
	  secret: "derpderpderpcats",
	  resave: false,
	  saveUninitialized: false
	}));
	```

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
		* stylesheets folder
			* style.css 
	* bin folder
		* www - provides the set up for our app 

This is a great start!  But there are still a few things that we need to add.


##### Back to the set up
1. `mkdir models`
2. `touch db.js seeds.js models/author.js routes/authors.js`

<br />

### Back to the app: Adding in bootstrap
##### In the views/layout.hbs
In the head tag, above the `stylesheets/style.css` link, add this link:

```
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
```
Just above the closing body tag (below the {{{ body }}} tag):

```
<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
```

<br />

### Setting up the Database
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

### Setting up the author model
##### In the models/author.js, add:
```
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.promise = global.Promise;

var AuthorSchema = new Schema({
    first_name: String,
    last_name: String,
    country: String,
    book_title: String,
    publication_year: String
});

AuthorSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

AuthorSchema.virtual('fullName').get(function () {
    return this.first_name + ' ' + this.last_name;
});

module.exports = mongoose.model("Author", AuthorSchema);

```

1. Virtual attributes allow you to create data that will not be persisted to the database.
2. Read more about [virtual attributes](http://mongoosejs.com/docs/guide.html)

<br />

### Setting up the author controller/route for the index
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

### Setting up the author seeds
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

### Setting up the routes/author's index route to show our data
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

![author's index in postman](https://i.imgur.com/FzCDIrw.png)

<br />

### Setting up the views/author's index view to show our data

##### In the terminal:
1. `mkdir views/authors`
2. `touch views/authors/index.hbs`

##### In our routes/authors.js, update our index route:
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
            // res.send(authors);
            res.render('authors/index', {
            	  authors: authors
            });
        });
});

module.exports = router;
```

##### In our views/authors/index.hbs:
```
<h1>My Favorite Authors</h1>

<ol>
    {{#each authors}}
    <li>
        <h1><a href="/authors/{{this.id}}">{{this.fullName}}</a></h1>
        <h3>{{this.country}}</h3>
        <p>{{this.bookTitle}}, {{this.publication_year}}</p>
    </li>
    {{/each}}
</ol>
```
**Notice that I added the a href link above, which will set us up for what we are doing next- the show route.**

1. restart npm- `control + c`, then `npm start`
2. Open the browser check that this works at localhost:3000/authors

<br />

### Because I am not a big fan of this basic css
##### In our public/stylesheets/style.css
```
body {
  padding: 50px;
  font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;
  text-align: center;
}

a {
    color: #000;
}

a:hover {
    color: #209aca;
}

ol {
    list-style-type: none;
    padding: 20px 0px;
}

ul {
    list-style-type: none;
    padding: 0px;
}

ol li {
    padding-bottom: 15px;
}

.btn.btn-primary, .btn.btn-danger {
    margin-top: 20px;
}

.btn.btn-default {
    margin-top: 50px;
}
```
1. Refresh the browser check that this works at localhost:3000/authors

Sweet! Our index page looks pretty great!  So, now we need to create our show page so that we can view each of these authors one-by-one.

<br />

### Setting up our routes/author's show route
##### In our routes/authors.js
```
// show author
router.get('/:id', function(req, res) {
    Author.findById(req.params.id)
        .exec(function(err, author) {
            if(err) console.log(err);

            console.log(author);
            res.send(author);
        });
});
```
1. restart npm- `control + c`, then `npm start`
2. Open postman and from the index page, copy the id of an author at localhost:3000/authors
3. Add that id to the end of the url localhost:3000/authors/:id

![author's show in postman](https://i.imgur.com/yvU2PQx.png)

<br />

### Now that we know that it works
##### In our terminal
1. `touch views/authors/show.hbs`

##### In our routes/authors.js
```
// show author
router.get('/:id', function(req, res) {
    Author.findById(req.params.id)
        .exec(function(err, author) {
            if(err) console.log(err);

            console.log(author);
            // res.send(author);
            res.render('authors/show', {
                author: author
            });
        });
});
```

##### In our views/authors/show.hbs
```
<h1>{{author.fullName}}</h1>
<h3>{{author.country}}</h3>
<p>{{author.bookTitle}}, {{author.publication_year}}</p>

<a href="/authors" class="btn btn-default">Main Page</a>
```
1. restart npm- `control + c`, then `npm start`
2. Open the browser check that this works at localhost:3000/authors/:id

Great!  We have a working index and a working show route!  So, we have the 'R' in CRUD. Let's work on the 'C' next.

<br />

### Setting up our routes/author's new route
##### In our terminal
1. `touch views/authors/new.hbs`

##### In our routes/authors.js (above our show route- because order matters)
```
// new author
router.get('/new', function(req, res) {
    res.render('authors/new');
});
```

##### In our views/authors/new.hbs
```
<h1>Create a New Author</h1>

<div class="row">
    <form action="/authors" method="POST" class="col-md-6 col-md-offset-3">
        <div class="form-group">
            <label for="first_name">First Name:</label>
            <input type="text" name="first_name" class="form-control">
        </div>
        <div class="form-group">
            <label for="last_name">Last Name:</label>
            <input type="text" name="last_name" class="form-control">
        </div>
        <div class="form-group">
            <label for="country">Country:</label>
            <input type="text" name="country" class="form-control">
        </div>
        <div class="form-group">
            <label for="book_title">Book Title:</label>
            <input type="text" name="book_title" class="form-control">
        </div>
        <div class="form-group">
            <label for="publication_year">Publication Year:</label>
            <input type="text" name="publication_year" class="form-control">
        </div>
        <div>
            <input type="submit" value="Submit" class="btn btn-primary">
        </div>
    </form>
</div>

<a href="/authors" class="btn btn-default">Main Page</a>

```

##### In our views/authors/index.hbs, add a new route underneath your ol tag:
```
<a href="/authors/new" class="btn btn-default">Create a New Author</a>
``` 

1. restart npm- `control + c`, then `npm start`
2. Add that id to the end of the url localhost:3000/authors/new

However, if we hit submit, we will get a 404 error because we haven't created our post route yet.

<br />

### Create our routes/author's post route
##### In our routes/authors.js
```
// create author
router.post('/', function(req, res) {
    var author = new Author({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        country: req.body.country,
        book_title: req.body.book_title,
        publication_year: req.body.publication_year
    });
    author.save(function(err, author){
        if (err) { console.log(err); }

        console.log(author);
        res.send(author);
    });
});
```

1. restart npm- `control + c`, then `npm start`
2. Open postman and go to localhost:3000/authors, with the POST http verb selected.
3. In the body, make sure the x-www.form-urlencoded is clicked.
4. add these key value pairs 
	* first_name: "Shel"
	* last_name: "Silverstein"
	* country: "United State"
	* book_title: "The Giving Tree"
	* publication_year: "1964"

![author's post in postman](https://i.imgur.com/qIodAQo.png)

Check it out!  We have a working new and post route!  So, we have the 'CR' in CRUD. Let's work on the 'U' next.

<br />

### Setting up our routes/author's edit route
##### In our terminal
1. `touch views/authors/edit.hbs`

##### In our routes/authors.js (above our show route- because order matters)
```
// edit author
router.get('/:id/edit', function(req,res) {
    Author.findById(req.params.id)
    .exec(function(err, author) {
        if (err) { console.log(err); }

        res.render('authors/edit', {
            author: author
        });
    });
});
```

##### In our views/authors/edit.hbs
```
<h1>Edit {{author.fullName}}</h1>

<div class="row">
    <form action="/authors/{{author.id}}?_method=PATCH" method="POST" class="col-md-6 col-md-offset-3">
        <div class="form-group">
            <label for="first_name">First Name:</label>
            <input type="text" name="first_name" value="{{author.first_name}}" class="form-control">
        </div>
        <div class="form-group">
            <label for="last_name">Last Name:</label>
            <input type="text" name="last_name" value="{{author.last_name}}" class="form-control">
        </div>
        <div class="form-group">
            <label for="country">Country:</label>
            <input type="text" name="country" value="{{author.country}}" class="form-control">
        </div>
        <div class="form-group">
            <label for="book_title">Book Title:</label>
            <input type="text" name="book_title" value="{{author.book_title}}" class="form-control">
        </div>
        <div class="form-group">
            <label for="publication_year">Publication Year:</label>
            <input type="text" name="publication_year" value="{{author.publication_year}}" class="form-control">
        </div>
        <div>
            <input type="submit" value="Submit" class="btn btn-primary">
        </div>
    </form>
</div>

<div>
    <a href="/authors/{{author.id}}" class="btn btn-default">Back</a>
    <a href="/authors" class="btn btn-default">Main Page</a>
</div>
```

##### In our views/authors/show, add a new route below your ul tag:
```
<div>
    <a href="/authors/{{author.id}}/edit" class="btn btn-primary">Edit {{author.fullName}}</a>
</div>
``` 

1. restart npm- `control + c`, then `npm start`
2. Click on the main author's page, click on the show link, click on the edit linklocalhost:3000/authors/:id/edit

However, if we hit submit, we will get a 404 error because we haven't created our update route yet.

<br />

### Create our routes/author's update route
##### In our routes/authors.js
```
// update author
router.patch('/:id', function(req, res) {
    Author.findByIdAndUpdate(req.params.id, {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        country: req.body.country,
        book_title: req.body.book_title,
        publication_year: req.body.publication_year
    })
        .exec(function(err, author) {
            if (err) { console.log(err); }

            console.log(author);
            res.send(author);
        });
});
```

##### In our views/authors/show, add a edit link below your ul tag:
```
<div>
    <a href="/authors/{{author.id}}/edit" class="btn btn-primary">Edit {{author.fullName}}</a>
</div>
``` 

1. restart npm- `control + c`, then `npm start`
2. Open postman and go to localhost:3000/authors, copy the id of an author.
3. Open localhost:3000/authors/:id/edit
3. Change the HTTP verb to PATCH.
3. In the body, make sure the x-www.form-urlencoded is clicked.
4. add these key value pairs 
	* first_name: "Shel"
	* last_name: "Silverstein"
	* country: "United States"
	* book_title: "The Giving Tree"
	* publication_year: "1964"

![author's update in postman](https://i.imgur.com/K1xJIHh.png)

<br />


### Now that we know that our update route works
##### In our routes/authors.js
```
// update author
router.patch('/:id', function(req, res) {
    Author.findByIdAndUpdate(req.params.id, {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        country: req.body.country,
        book_title: req.body.book_title,
        publication_year: req.body.publication_year
    }, { new: true })
        .exec(function(err, author) {
            if (err) { console.log(err); }

            console.log(author);
            // res.send(author);
            res.render('authors/show', {
                author: author
            });
        });
});
```

Yes!  We have a working edit and update route!  So, we have the 'CRU' in CRUD. Let's work on the our last action, the 'D'!

<br />

### Create our routes/author's delete route
##### In our routes/authors.js
```
// delete author
router.delete('/:id', function(req, res) {
    Author.findByIdAndRemove(req.params.id)
        .exec(function(err, author) {
            if (err) { console.log(err); }

            console.log('Author deleted.');
            // redirect back to the index route
            res.redirect('/authors');  
        });
});
```

##### In our views/authors/show, add a delete form below your edit div:
```
<form action="/authors/{{author.id}}?_method=DELETE" method="POST">
    <input type="submit" value="DELETE" class="btn btn-danger" />
</form>
``` 

1. restart npm- `control + c`, then `npm start`
2. Open the browser, go to localhost:3000/authors, click on an author, click on the delete link.
3. It should redirect you back to the main page.

Yesyesyesyesyes! Our shit works.  Full CRUD!

<br />

**Now, you just have to add the user/bcrypt info in.  And you're good!**