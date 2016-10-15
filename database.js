/* jshint node: true */
'use strict';
var mysql      = require('mysql');
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var saltRounds = 10;
var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME
});
module.exports = connection;

var getAppDetails = function  (secret_id,callback) {
	connection.query('select id from apps where secret_id = "'+secret_id+'" and is_active = 1',function  (err,rows) {
		if (err) throw err;
		callback(rows);
	});
};

var getUserDetail = function  (secret_id,callback) {
	connection.query('select * from users where secret_id = "'+secret_id+'"',function  (err,rows) {
		if (err) throw err;
		callback(rows);
	});
};

exports.createApp = function  (name, callback) {
	connection.query('select id from apps where name="'+name+'"',function(err, rows) {
		if (err) throw err;
		if (rows.length) {
			callback('exists',rows);
		}else{
			var time = new Date();
			time = time.getTime();
			var secret_id = name+time;
			secret_id = crypto.createHash('md5').update(secret_id).digest('hex');
			connection.query('insert into apps (id, name, secret_id, is_active, created_at) values (default, "'+name+'", "'+secret_id+'", 1, "'+time+'")',function(err) {
				if (err) throw err;
				callback('inserted',secret_id);
			});
		}
	});
};

exports.deactivateApp = function (secret_id, callback) {
	connection.query('update apps set is_active = 0 where secret_id = "'+secret_id+'"', function (err, result) {
		if (err) throw err;
		if (result.affectedRows) {
			callback('success');
		}else{
			callback('app not exist');
		}
	});
};

exports.createUser = function  (data, callback) {
	connection.query('select id from users where name = "'+data.name+'" and password = "'+data.password+'"',function  (err,rows) {
		if (err) throw err;
		if (rows.length) {
			callback('exists',rows);
		}else{
			getAppDetails(data.app_secret,function  (result) {
				if (result.length) {
					var time = new Date();
					time = time.getTime();
					var secret_id = data.name+data.password+data.app_secret+time;
					secret_id = crypto.createHash('md5').update(secret_id).digest('hex');
					bcrypt.hash(data.password, saltRounds, function(err, hash) {
						connection.query('insert into users (id, name, password, secret_id, app_id, is_active, created_at, updated_at) values (default, "'+data.name+'", "'+hash+'", "'+secret_id+'", "'+result[0].id+'", "'+time+'", "'+time+'")',function  (err) {
							if (err) throw err;
							callback('inserted',secret_id);
						});
					});
				}else{
					callback('app not exist');
				}
			});
		}
	});
};

exports.deactivateUser = function (data, callback) {
	getAppDetails(data.app_secret, function (result) {
		if (result.length === 0) {
			callback('app not exist');
		}else{
			connection.query('update users set is_active = 0 where secret_id = "'+data.user_secret+'"', function (err, result) {
				if (result.affectedRows) {
					callback('success');
				}else{
					callback('user not exist');
				}
			});
		}
	});
};

exports.updateUserSecret = function (data, callback) {
	getAppDetails(data.app_secret, function (result) {
		if (result.length === 0) {
			callback('app not exist');
		}
	});
	getUserDetail(data.user_secret, function (result) {
		if (result.length) {
			var time = (new Date()).getTime();
			var secret_id = data.name+data.password+data.app_secret+time;
			secret_id = crypto.createHash('md5').update(secret_id).digest('hex');
			connection.query('update users set secret_id = "'+secret_id+'" where secret_id = "'+data.user_secret+'"', function(result){
				if (result.affectedRows) {
					callback('success');
				}
			});
		}
		callback('user not exist');
	});
};

exports.getUserByCredentials = function (data, callback) {
	getAppDetails(data.app_secret, function (result) {
		if (result.length === 0) {
			callback('app not exist');
		}else{
			var app_id = result[0].id;
			connection.query('select * from users where name = "'+data.name+'" and app_id = "'+app_id+'"', function (err, rows) {
				if (err) throw err;
				rows.forEach(function (row) {
					bcrypt.compare(data.password, row.password, function(err, res) {
						if (res) {
							callback('success', row);
						}
					});
				});
			});
			callback('user not exist');
		}
	});
};

exports.createNotification = function  (data,callback) {
	getAppDetails(data.app_secret,function  (result) {
		if (result.length === 0) {
			callback('app not exist');
		}
	});
	getUserDetail(data.user_secret,function  (result) {
		if (result.length) {
			var time = (new Date()).getTime();
			connection.query('insert into notifications (id,user_id,is_notified,text,image,notification_link_url,created_at) values (default,"'+result[0].id+'",default,"'+data.text+'","'+data.image+'","'+data.notification_link+'","'+time+'")',function  (err) {
				if (err) throw err;
				connection.query('select socket_id from user_socket_ids where user_id = "'+result[0].id+'"', function (err, rows) {
					if (err) throw err;
					callback('inserted', rows);
				});
			});
		} else {
			callback('user not exist');
		}
	});
};

exports.updateSocketId = function  (data) {
	getUserDetail(data.secret_id,function  (result) {
		if (result.length) {
			connection.query("insert into user_socket_ids (socket_id, user_id) values ('"+data.socket_id+"', '"+result[0].id+"')", function (err) {
				if (err) throw err;
			});
		}
	});
};

exports.getNotification = function  (data,callback) {
	connection.query('select text,image,notification_link_url,created_at as time from notifications where user_id = "'+data.secret_id+'" order by created_at asc limit '+data.count+'',function  (err,rows) {
		if (err) throw err;
		callback(rows);
	});
};

exports.removeSocket = function (data) {
	connection.query('delete from user_socket_ids where socket_id = "'+data+'"', function (err) {
		if (err) throw err;
	});
};
