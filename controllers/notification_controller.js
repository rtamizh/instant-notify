var AuthMiddleware = require('../middlewares/auth_middleware.js');

var Notification = require('../models/notification.js');
var UserSocket = require('../models/user_socket.js');
var io = require('../routes/socket.js');

exports.create = function (req, res) {
	AuthMiddleware.validate(req, res, function (user) {
		var data = {
			user_id: user,
			text : req.body.text,
			image : req.body.image,
			notification_link : req.body.notification_link
		};
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
	})
}