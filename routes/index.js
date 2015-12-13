var express = require('express');
var router = express.Router();
var database = require('../database.js');
var app = require('../app.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/app/create', function  (req,res,next) {
	name = req.body.name;
	console.log(name);
	//return true;
	database.createApp(name,function  (msg,result) {
		console.log(result);
		if (msg == 'exists') {
			res.json({
				error_code:400,
				error_msg:'name already exists',
				message:'error'
			})
		}else{
			res.json({
				app_secret:result,
				message:'success'
			})
		}
	});
})

router.post('/app/user/create',function  (req,res,next) {
	data = {
		name : req.body.name,
		app_secret : req.body.app_secret,
		password : req.body.password
	};
	database.createUser(data,function  (msg,result) {
		console.log(result);
		if (error_msg == 'exists') {
			res.json({
				error_code:400,
				error_msg:'name already exists',
				message:'error'
			})
		}else if (msg == 'app not exist') {
			res.json({
				error_code:401,
				error_msg:'app not exist',
				message:'error'
			})
		}else{
			res.json({
				user_secret	:result,
				message:'success'
			})
		}
	})
})

router.post('/app/notification/create',function  (req,res,next) {
	data = {
		app_secret : req.body.app_secret,
		user_secret : req.body.user_secret,
		text : req.body.text,
		image : req.body.image,
		notification_link : req.body.notification_link
	}
	database.createNotification(data,function  (msg,result) {
		console.log(result);
		if (msg == 'inserted') {
			var time = (new Date).getTime();
			app.io.to(result).emit('notification',{text:data.text,image:data.image,notification_link:data.notification_link,time:time});
			res.json({
				message:'success'
			})
		}else if (msg == 'app not exist') {
			res.json({
				error_code:401,
				error_msg:'app not exist',
				message:'error'
			})
		}else if (msg == 'user not exist') {
			res.json({
				error_code:401,
				error_msg:'user not exist',
				message:'error'
			})
		};
	})
})

module.exports = router;
