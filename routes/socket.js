/* jshint node: true */
'use strict';
var socket_io = require( "socket.io" );
var UserSocket = require('../models/user_socket.js');
var User = require('../models/user.js');
var Log = require('../models/log.js');

var io = socket_io();
// create socket.io connection functionalities
io.on('connection',function  (socket) {

	// user will login with their unique user id
	socket.on('login',function  (req) {
		var data = {
			socket_id : socket.id,
			secret_id : req.user_secret_id
		};
		User.getDetails(data.secret_id, function (user) {
			if (user.length) {
				data.user_id = user[0].id;
				UserSocket.updateSocketId(data);
			}
		})
  	});

  	// user log store
  	socket.on('log', function(req) {
  		var action = req.action;
      var message = null;
      if (req.message) {
        message = req.message;
      }
  		UserSocket.getUserBySocket(socket.id, function (user_socket) {
  			if (user_socket) {
  				User.find(user_socket.user_id, function (user) {
  					if (user) {
  						var data = {
  							user_id: user.id,
  							app_id: user.app_id,
  							action: action,
  							message: message
  						}
  						Log.create(data);
  					}
  				})
  			}
  		})
  	})

	// 	User will ask for notification from browser, it will be useful if app handle all notification with this server
	// socket.on('requestNotification',function  (req) {
	// 	var data = {
	// 		socket_id : socket.id,
	// 		secret_id : req.user_secret_id,
	// 		count : req.count
	// 	};
	// 	database.getNotification(data,function  (result) {
	// 		io.to(socket.id).emit('receiveNotification',result);
	// 	});
 //  	});

	//	on disconnect the socket id is deleted so that it will not be taken to send notification
  	socket.on('disconnect', function () {
  		UserSocket.removeSocket(socket.id);
  	});
});

module.exports = io;
