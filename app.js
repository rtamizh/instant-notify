var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socket_io    = require( "socket.io" );
var database = require("./database.js");

database.connection.connect(function  (err) {
  if (err) throw err;
  console.log('connected');
})


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// Socket.io
exports.io =io          = socket_io();
app.io           = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', routes);
app.use('/test', users);
app.use(function  (req,res,next) {
  req.connection = connection;
  next();
})

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


io.on('connection',function  (socket) {
  console.log('a new user connected'+socket.id);
  socket.on('login',function  (req) {
    console.log(req);
    data = {
      socket_id : socket.id,
      secret_id : req.user_secret_id
    }
    database.updateSocketId(data,function  (msg,result) {
      if (msg == 'success') {
        console.log('success');
      }else{
        console.log('error');
      }
    })
    //io.emit('notification',data);
    //io.to(socket.id).emit('notification', data);
  })
  socket.on('requestNotification',function  (req) {
    console.log('request'+req);
    data = {
      socket_id : socket.id,
      secret_id : req.user_secret_id,
      count : req.count
    }
    database.getNotification(data,function  (result) {
      console.log(result);
      io.to(socket.id).emit('receiveNotification',result);
    })
  })
})


module.exports = app;