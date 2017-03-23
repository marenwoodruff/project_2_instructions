var express = require('express');
var app = express();
var hbs = require('hbs');
var morgan = require('morgan');
var methodOverride = require('method-override');
var port = process.env.PORT || 3000;

app.set('view engine', hbs);
app.use(express.static(__dirname + '/public'));



app.listen(port, function() {
    console.log('listening on port ' + port);
});
