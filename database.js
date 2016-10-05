var mysql      = require('mysql');
var crypto = require('crypto');
var app = require('./app.js');
module.exports.connection = connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME
});


exports.createApp = function  (name,callback) {
	console.log(name);
	connection.query('select id from apps where name="'+name+'"',function(err,rows,fields) {
		if (err) throw err;
		if (rows.length) {
			callback('exists',rows);
		}else{
			var time = new Date;
			time = time.getTime();
			var secret_id = name+time;
			secret_id = crypto.createHash('md5').update(secret_id).digest('hex');
			connection.query('insert into apps (id,name,secret_id,is_active,created_at) values (default,"'+name+'","'+secret_id+'",0,"'+time+'")',function(err,rows,fields) {
				if (err) throw err;
				callback('inserted',secret_id);
			});
		}
	})
}

exports.createUser = function  (data,callback) {
	connection.query('select id from users where name = "'+data.name+'" and password = "'+data.password+'"',function  (err,rows,fields) {
		if (err) throw err;
		if (rows.length) {
			callback('exists',rows);
		}else{
			getAppDetails(data.app_secret,function  (result) {
				console.log(result);
				if (result.length) {
					var time = new Date;
					time = time.getTime();
					var secret_id = data.name+data.password+data.app_secret+time;
					secret_id = crypto.createHash('md5').update(secret_id).digest('hex');
					connection.query('insert into users (id,name,password,secret_id,app_id,created_at,updated_at) values (default,"'+data.name+'","'+data.password+'","'+secret_id+'","'+result[0].id+'","'+time+'","'+time+'")',function  (err,rows,fields) {
						if (err) throw err;
						callback('inserted',secret_id);
					})
				}else{
					callback('app not exist');
				}
			})
		}
	})
}

exports.createNotification = function  (data,callback) {
	getAppDetails(data.app_secret,function  (result) {
		console.log(result);
		if (result.length == 0) {
			callback('app not exist');
		}
	});
	getUserDetail(data.user_secret,function  (result) {
		console.log(result);
		if (result.length) {
			time = (new Date).getTime();
			connection.query('insert into notifications (id,user_id,is_notified,text,image,notification_link_url,created_at) values (default,"'+result.id+'",default,"'+data.text+'","'+data.image+'","'+data.notification_link+'","'+time+'")',function  (err,rows,fields) {
				if (err) throw err;
				callback('inserted',result[0].socket_id);
			})
		}else{
			callback('user not exist');
		}
	})
}

getAppDetails = function  (secret_id,callback) {
	connection.query('select id from apps where secret_id = "'+secret_id+'"',function  (err,rows,fields) {
		if (err) throw err;
		callback(rows);
	})
}

getUserDetail = function  (secret_id,callback) {
	connection.query('select * from users where secret_id = "'+secret_id+'"',function  (err,rows,fields) {
		if (err) throw err;
		callback(rows);
	})
}

exports.updateSocketId = function  (data,callback) {
	getUserDetail(data.secret_id,function  (result) {
		console.log(result);
		if (result.length) {
			connection.query('update users set socket_id ="'+data.socket_id+'" where id = "'+result[0].id+'"',function  (err,rows,fields) {
				if (err) throw err;
				console.log(rows);
				callback('success',rows);
			})
		}else{
			callback('user not exist');
		}
	})
}

exports.getNotification = function  (data,callback) {
	console.log('select text,image,notification_link_url,created_at as time from notifications where user_id = "'+data.secret_id+'" order by created_at asc limit '+data.count+'');
	connection.query('select text,image,notification_link_url,created_at as time from notifications where user_id = "'+data.secret_id+'" order by created_at asc limit '+data.count+'',function  (err,rows,fields) {
		if (err) throw err;
		callback(rows);
	})
}