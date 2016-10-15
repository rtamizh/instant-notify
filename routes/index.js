/* jshint node: true */
'use strict';
var express = require('express');
var router = express.Router();
var appModel = require('../models/app.js');
var User = require('../models/user.js');
var Notification = require('../models/notification.js');
var UserSocket = require('../models/user_socket.js');
var io = require('./socket.js');

//	create notification application (to handle multiple application)
router.post('/app/create', function  (req,res) {
	var name = req.body.name;
	appModel.getByName(name, function (result) {
		if (result.length) {
			res.json({
				error_code:10,
				error_msg:'name already exists',
				message:'error'
			});
		}else{
			appModel.create(name,function  (result) {
				res.json({
					app_secret:result,
					message:'success'
				});
			});
		}
	})
});

//	deactivate the application
router.post('/app/deactivate', function (req, res) {
	var app_secret = req.body.app_secret;
	appModel.deactivate(app_secret, function (result) {
		if (result) {
			res.json({
				message: 'success'
			});
		}else{
			res.json({
				error_code: 11,
				error_msg: 'app not exists',
				message: 'error'
			});
		}
	});
});

//	create user for specific application
router.post('/app/user/create',function  (req,res) {
	var data = {
		name : req.body.name,
		app_secret : req.body.app_secret,
		password : req.body.password
	};
	appModel.getDetails(data.app_secret, function (app) {
		if (app.length == 0) {
			res.json({
				error_code:11,
				error_msg:'app not exist',
				message:'error'
			});
		}else{
			data.app_id = app[0].id;
			User.create(data, function function_name(secret) {
				res.json({
					user_secret	:secret,
					message:'success'
				});
			})
		}
	})
});

router.post('/user/deactivate', function (req, res) {
	var data = {
		app_secret : req.body.app_secret,
		user_secret : req.body.user_secret
	};
	appModel.getDetails(data.app_secret, function (app) {
		if (app.length == 0) {
			res.json({
				error_code: 11,
				error_msg: 'app not exist',
				message: 'error'
			});
		}else{
			User.getDetails(data.user_secret, function (user) {
				if (user.length == 0) {
					res.json({
						error_code: 12,
						error_msg: 'user not exist',
						message: 'error'
					});
				}else{
					User.deactivate(data, function (result) {
						if (result) {
							res.json({
								message: 'success'
							});
						}else{
							res.json({
								error_code: 20,
								error_msg: 'unknown error',
								message: 'error'
							});
						}
					})
				}
			})
		}
	})
});

router.post('/user/secret/update', function (req,res) {
	var data = {
		app_secret : req.body.app_secret,
		user_secret : req.body.user_secret
	};
	appModel.getDetails(data.app_secret, function (app) {
		if (app.length == 0) {
			res.json({
				error_code: 11,
				error_msg: 'app not exist',
				message: 'error'
			});
		}else{
			User.updateSecret(data, function (result) {
				if (result.length) {
					res.json({
						secret_id: result[0].secret_id,
						message: 'success'
					});
				}else{
					res.json({
						error_code: 12,
						error_msg: 'user not exist',
						message: 'error'
					});
				}
			})
		}
	})
});

router.post('/user/secret/get', function (req, res) {
	var data = {
		name: req.body.name,
		password: req.body.password,
		app_secret: req.body.app_secret
	};
	appModel.getDetails(data.app_secret, function (app) {
		if (app.length == 0) {
			res.json({
				error_code: 11,
				error_msg: 'app not exist',
				message: 'error'
			});
		}else{
			data.app_id = result[0].id;
			getByCredentials(data, function (user) {
				if (user.lenght) {
					res.json({
						user_secret: user[0].secret_id,
						message: 'success'
					});
				}else{
					res.json({
						error_code: 12,
						error_msg: 'user not exist',
						message: 'error'
					});
				}
			})
		}
	})
});

// create notification for user
router.post('/app/notification/create',function  (req, res) {
	var data = {
		app_secret : req.body.app_secret,
		user_secret : req.body.user_secret,
		text : req.body.text,
		image : req.body.image,
		notification_link : req.body.notification_link
	};
	appModel.getDetails(data.app_secret, function (app) {
		if (app.length == 0) {
			res.json({
				error_code: 11,
				error_msg: 'app not exist',
				message: 'error'
			});
		}else{
			data.app_id = app[0].id;
			User.getDetails(data.user_secret, function (user) {
				if (user.length == 0) {
					res.json({
						error_code: 12,
						error_msg: 'user not exist',
						message: 'error'
					});
				}else{
					data.user_id = user[0].id;
					Notification.create(data, function (row) {
						if (row.length == 0) {
							res.json({
								error_code: 20,
								error_msg: 'unknown error',
								message: 'error'
							});
						}else{
							UserSocket.getUserSockets(data.user_id, function (sockets) {
								console.log(res.io);
								sockets.forEach(function (element) {
									var time = (new Date).getTime();
									io.to(element.socket_id).emit('notification',{text:data.text,image:data.image,notification_link:data.notification_link,time:time});
								});
								res.json({
									message:'success'
								});
							})
						}
					})
				}
			})
		}
	})
});

module.exports = router;
