var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mustacheExpress = require('mustache-express');

// Mongo
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/superslide');


var routes = require('./routes/index');
var app = express();

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('public'));
  
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);

module.exports = app;
var server = app.listen(8081);
