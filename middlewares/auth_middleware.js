var appModel = require('../models/app.js');
var User = require('../models/user.js');

exports.user_validate = function (req, res, next) {
	var data = {
		app_secret : req.body.app_secret
	};

	appModel.getDetails(data.app_secret, function (app) {
		if (app.length == 0) {
			res.json({
				error_code: 11,
				error_msg: 'app not exist',
				message: 'error'
			});
		}else{
			if (req.body.user_secret != undefined) {
				User.getDetails(req.body.user_secret, function (user) {
					if (user.length == 0) {
						res.json({
							error_code: 12,
							error_msg: 'user not exist',
							message: 'error'
						});
					}else{
						req.user = user[0];
						next();
					}
				});
			}else if (req.body.password != undefined) {
				data['password'] = req.body.password;
				data['name'] = req.body.name;
				data['app_id'] = app[0].id;
				User.getByCredentials(data, function (user) {
					if (user) {
						req.user = user;
						next();
					}else{
						res.json({
							error_code: 12,
							error_msg: 'user not exist',
							message: 'error'
						});
					}
				})
			}
		}
	});
}
