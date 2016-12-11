var appModel = require('../models/app.js');
var User = require('../models/user.js');

exports.validate = function (req, res) {
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
			if (req.body.app_secret != undefined) {
				User.getDetails(req.body.app_secret, function (user) {
					if (user.length == 0) {
						res.json({
							error_code: 12,
							error_msg: 'user not exist',
							message: 'error'
						});
					}else{
						callback(user[0]);
					}
				});
			}else if (req.body.password != undefined) {
				data['password'] = req.body.password;
				data['name'] = req.body.name;
				getByCredentials(data, function (user) {
					if (user.lenght) {
						callback(user[0]);
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
