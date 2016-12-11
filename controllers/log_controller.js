var AuthMiddleware = require('../middlewares/auth_middleware.js');

var Log = require('../models/log.js');
var Utils = require('../lib/utils.js');

exports.create = function (req, res) {
	var data = {
		app_id : req.user.app_id,
		user_id : req.user.id,
		action : req.body.action,
		message : req.body.message
	};
	Log.create(data);
	res.json({
		message:'success'
	});
}

exports.get = function (req, res) {
	var data = {
		user_id: req.user.id,
		action: Utils.isset(req.body, 'action'),
		message: Utils.isset(req.body, 'message'),
		from: Utils.isset(req.body, 'from'),
		to: Utils.isset(req.body, 'to')
	};
	Log.get(data, function (logs) {
		res.json({
			message: 'success',
			logs: logs
		})
	})
}
