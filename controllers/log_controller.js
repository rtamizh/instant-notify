var AuthMiddleware = require('../middlewares/auth_middleware.js');

var Log = require('../models/log.js');

exports.create = function (req, res) {
	AuthMiddleware.validate(req, res, function (user) {
		var data = {
			app_id : user.app_id,
			user_id : user.user_id,
			action : req.body.action,
			message : req.body.message
		};
		Log.create(data);
		res.json({
			message:'success'
		});
	})
}
