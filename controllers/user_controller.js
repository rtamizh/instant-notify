var appModel = require('../models/app.js');
var User = require('../models/user.js');
// var AuthMiddleware = require('../middlewares/auth_middleware.js');

exports.create = function (req, res) {
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
}

exports.deactivate = function (req, res) {
	User.deactivate(req.user, function (result) {
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

exports.updateSecret = function (req, res) {
	User.updateSecret(req.user, function (result) {
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

exports.getSecretByCredentials = function (req, res) {
	res.json({
		user_secret: req.user.secret_id,
		message: 'success'
	});
}
