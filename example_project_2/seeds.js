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
  book_title: 'The Little Prince',
  publication_year: '1943'
});

var fforde = new Author({
  first_name: 'Jasper',
  last_name: 'Fforde',
  country: 'England',
  book_title: 'The Eyre Affair',
  publication_year: '2001'
});

var willig = new Author({
  first_name: 'Lauren',
  last_name: 'Willig',
  country: 'United States',
  book_title: 'The Secret History of the Pink Carnation',
  publication_year: '2000'
});

var lutz = new Author({
  first_name: 'Lisa',
  last_name: 'Lutz',
  country: 'Unites States',
  book_title: 'The Spellman Files: A Novel',
  publication_year: '2007'
});

saintExupery.save(function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('de Saint-Exupery created!');
});

fforde.save(function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Fforde created!');
});

willig.save(function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Willig created!');
});

lutz.save(function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Lutz created!');
});
