var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Mongo
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('192.168.3.150:27017/superslide');



var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();


// view engine setup
var mustacheExpress = require('mustache-express');

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// send files 
  app.use('/scripts', express.static(__dirname + '/public/scripts'));
  app.use('/pictures', express.static(__dirname + '/public/pictures'));
  app.use('/images', express.static(__dirname + '/public/images'));
  app.use('/fonts', express.static(__dirname + '/public/fonts'));
  app.use('/style', express.static(__dirname + '/public/style'));
  app.use(express.static(__dirname + '/public'));
  
// db
app.use(function(req,res,next){
    req.db = db;
    next();
});
app.use('/', routes);
app.use('/users', users);

//app.register('.html', require('jade'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// Verification



module.exports = app;
var server = app.listen(8081, function() {
console.log('Listening on port %d', server.address().port);
});
