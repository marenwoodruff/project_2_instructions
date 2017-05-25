var express = require('express');
var router = express.Router();

var Author = require('../models/author');

// index authors
router.get('/', function(req, res) {
  // res.send('authors will be here');
  Author.find({})
  .exec(function(err, authors) {
    if(err) {
      console.log(err);
      return;
    }

    console.log(authors);
    // res.send(authors);
    res.render('authors/index', {
      authors: authors
    });
  });
});

// new author
router.get('/new', function(req, res) {
  res.render('authors/new');
});

// create author
router.post('/', function(req, res) {
  var author = new Author({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    country: req.body.country,
    book_title: req.body.book_title,
    publication_year: req.body.publication_year
  });
  author.save(function(err, author) {
    if (err) {
      console.log(err);
      return;
    }

    console.log(author);
    // res.send(author);
    res.render('authors/show', {
      author: author
    })
  });
});

// show author
router.get('/:id', function(req, res) {
  Author.findById(req.params.id)
    .exec(function(err, author) {
      if (err) {
        console.log(err);
        return;
      }

      console.log(author);
      // res.send(author);
      res.render('authors/show', {
        author: author
      })
    });
});

// edit author
router.get('/:id/edit', function(req,res) {
  Author.findById(req.params.id)
  .exec(function(err, author) {
    if (err) {
      console.log(err);
      return;
    }

    res.render('authors/edit', {
      author: author
    });
  });
});

// update author
router.patch('/:id', function(req, res) {
  Author.findByIdAndUpdate(req.params.id, {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    country: req.body.country,
    book_title: req.body.book_title,
    publication_year: req.body.publication_year
  }, {new: true})
  .exec(function(err, author) {
    if (err) {
      console.log(err);
      return;
    }

    console.log(author);
    // res.send(author);
    res.render('authors/show', {
      author: author
    })
  });
});

// delete author
router.delete('/:id', function(req, res) {
  Author.findByIdAndRemove(req.params.id)
    .exec(function(err, author) {
      if (err) {
        console.log(err);
        return;
      }

      console.log('Author deleted.');
      // res.send('Author deleted.');
      // redirect back to the index route
      res.redirect('/authors');
    });
});

module.exports = router;
