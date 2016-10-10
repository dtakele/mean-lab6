var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var validator = require('express-validator');

var csrf = require('csurf');

var routes = require('./routes/index');
var users = require('./routes/users');
var contactus = require('./routes/contactus');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
app.use(csrf());

app.post('/contactus', function(req, res){
    req.assert('name', 'Name is required').notEmpty();
    req.assert('message', 'Message is required').notEmpty();
    console.log(req.body.name);
    var errors = req.validationErrors();
    for(let i=0;i<errors.length;i++) {
      console.log(errors[i].msg);
    }

    if(errors) {
      res.render('contactus', { title: 'Contact Us', message:'', errors: errors, csrfToken: req.csrfToken() });
    }
    else{
            var postData = ""; 
            req.setEncoding("utf8"); 
            req.addListener("data", function(postDataChunk) { 
                console.log(`ChunckSize: ${postDataChunk.length}`)
                postData += postDataChunk; 
            }); 
            
            req.addListener("end", function() { 
                //res.end('Thank you ' +req.body.name);
                res.render('contactus', { title: 'Contact Us', message: 'Thank You',errors: {},csrfToken: req.csrfToken() });
                
                console.log(`postData: ${postData}`)

                fs.writeFile('contactdata.txt',postData);
                
            });
    }

});

app.use('/', routes);
app.use('/users', users);

app.get('/contactus', function(req,res){
  res.render('contactus',{ title: 'Contact Us', message: '',errors: {}, csrfToken: req.csrfToken() });
})
//app.use('/contactus', contactus);

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

app.listen(4000);
console.log('Server started at 4000');
module.exports = app;
