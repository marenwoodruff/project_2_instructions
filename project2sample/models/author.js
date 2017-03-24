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
