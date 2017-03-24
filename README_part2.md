# Project 2: Part 2

## Adding Embedded Functionality to our app
##### In the routes/author.js
```

// book index
router.get('/:id/books', function(req, res) {
    Author.findById(req.params.id)
        .exec(function(err, author) {
            res.render('books/index', {
                author: author
            });
        })
});

// add a new book
router.post('/:id/books', function(req, res) {
    Author.findById(req.params.id)
        .exec(function(err, author) {
            if (err) { console.log(err); }

            author.books.push(new Book({title: req.body.title, publication_year: req.body.publication_year}));
            author.save(function(err) {
              if (err) console.log(err);
              
              // res.send(author);
              res.render('/authors/show');
            });
        });
});

// new book
router.get('/:id/books/new', function(req, res) {
    Author.findById(req.params.id)
        .exec(function(err, author) {
            res.render('books/new', {
                author: author
            });
        })
});

// create a new book
router.patch('/:authorId/books', function(req, res) {
    Author.findByIdAndUpdate(req.params.id)
        .exec(function(err, author) {
            if (err) { console.log(err); }

            const newBook = {
                title: req.body.title, 
                publication_year: req.body.publication_year
            };

            console.log('new book ', newBook);
            author.books.push(newBook);
            author.save(function(err) {
                if (err) console.log(err);

                console.log(author);
                // res.send(author);
                res.render('authors/show', {
                    author: author
                });
            });
        });
});

// remove a book
router.delete('/:authorId/books/:id', function(req, res) {
    Author.findByIdAndUpdate(req.params.authorId, {
        $pull: {
            books: {_id: req.params.id}
        }
    })
        .exec(function(err, book) {
            if (err) console.log(err);

            // res.send(book + " Book deleted");
            res.render('authors/show');
        });
});

```

##### In the views/books/new.hbs
```
<h1>Create a New Book for {{author.fullName}}</h1>

<div class="row">
    <form action="/authors/{{author.id}}?_method=PATCH" method="POST" class="col-md-6 col-md-offset-3">
        <div class="form-group">
            <label for="title">Title:</label>
            <input type="text" name="title" class="form-control">
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

##### In the AuthorSchema.js
```
var BookSchema = new Schema({
    title: String,
    publication_year: String
});

var AuthorSchema = new Schema({
    first_name: String,
    last_name: String,
    country: String,
    book: [BookSchema]
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

var AuthorModel = mongoose.model("Author", AuthorSchema);
var BookModel = mongoose.model("Book", BookSchema);

module.exports = {
    Author: AuthorModel,
    Book: BookModel
}
```

##### In the seeds.js
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

##### In views/authors/show.hbs
```
<h1>{{author.fullName}}</h1>
<h3>{{author.country}}</h3>
<ul>
    {{#each author.books}}
        <li>{{this.title}}, {{this.publication_year}}</li>
    {{/each}}
</ul>

<div>
    <a href="/authors/{{author.id}}/edit" class="btn btn-primary">Edit {{author.fullName}}</a>
    <br />
    <a href="/authors/{{author.id}}/books/new" class="btn btn-info">Add Books to this Author</a>
</div>

<form action="/authors/{{author.id}}?_method=DELETE" method="POST">
    <input type="submit" value="DELETE" class="btn btn-danger" />
</form>

<a href="/authors" class="btn btn-default">Main Page</a>
```

##### In views/authors/index.hbs
```
<h1>My Favorite Authors</h1>

<ol>
    {{#each authors}}
    <li>
        <h1><a href="/authors/{{this.id}}">{{this.fullName}}</a></h1>
        <h3>{{this.country}}</h3>
        {{#if this.books}}
        <ul>
            <li>
                {{#each this.books}}
                    {{this.title}}, {{this.publication_year}}
                {{/each}}
            </li>
        </ul>
        {{/if}}
    </li>
    {{/each}}
</ol>

<a href="/authors/new" class="btn btn-default">Create a New Author</a>
```