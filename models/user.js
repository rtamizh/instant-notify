/* jshint node: true */
'use strict';
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var saltRounds = 10;
var database = require('../config/database.js');

exports.getDetails = function  (secret_id,callback) {
	database.query('select * from users where secret_id = "'+secret_id+'"',function  (err,rows) {
		if (err) throw err;
		callback(rows);
	});
};

exports.create = function  (data, callback) {
	var time = new Date();
	time = time.getTime();
	var secret_id = data.name+data.password+data.app_secret+time;
	secret_id = crypto.createHash('md5').update(secret_id).digest('hex');
	bcrypt.hash(data.password, saltRounds, function(err, hash) {
		if (err) throw err;
		database.query('insert into users (id, name, password, secret_id, app_id, is_active, created_at, updated_at) values (default, "'+data.name+'", "'+hash+'", "'+secret_id+'", "'+data.app_id+'", 0, NOW(), NOW())',function  (err) {
			if (err) throw err;
			callback(secret_id);
		});
	});
};

exports.deactivate = function (data, callback) {
	database.query('update users set is_active = 0 where secret_id = "'+data.user_secret+'"', function (err, result) {
		callback(result.affectedRows);
	});
};

exports.getByCredentials = function (data, callback) {
	database.query('select * from users where name = "'+data.name+'" and app_id = "'+data.app_id+'"', function (err, rows) {
		if (err) throw err;
		rows.forEach(function (row, index) {
			bcrypt.compare(data.password, row.password, function(err, res) {
				if (res && index !== rows.length-1) {
					callback(row);
				}else if (res) {
					callback(row);
				} else{
					callback([]);
				}
			});
		});
	});
};

exports.updateSecret = function (data, callback) {
	var time = (new Date()).getTime();
	var secret_id = data.name+data.password+data.app_secret+time;
	secret_id = crypto.createHash('md5').update(secret_id).digest('hex');
	database.query('update users set secret_id = "'+secret_id+'" where secret_id = "'+data.user_secret+'"', function(result){
		if (result.affectedRows) {
			getDetails(secret_id, function (result) {
				callback(result);
			})
		}
	});
};

exports.find = function (user_id, callback) {
	database.query('select * from users where id = "'+user_id+'"', function (err, rows) {
		if (err) throw err;
		if (rows.length == 0) callback(null)
		callback(rows[0]);
	});
}
