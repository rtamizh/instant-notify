var appModel = require('../models/app.js');

exports.create = function (req, res) {
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
}

exports.deactivate = function (req, res) {
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
}
