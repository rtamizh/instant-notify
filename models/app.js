/* jshint node: true */
'use strict';
var crypto = require('crypto');
var database = require('../config/database.js');

exports.getDetails = function  (secret_id,callback) {
	database.query('select id from apps where secret_id = "'+secret_id+'" and is_active = 1',function  (err,rows) {
		if (err) throw err;
		callback(rows);
	});
};

exports.getByName = function (name, callback) {
	database.query('select id from apps where name="'+name+'"',function(err, rows) {
		if (err) throw err;
		callback(rows);
	})
}

exports.create = function  (name, callback) {
	//console.log(database);
	var time = new Date();
	time = time.getTime();
	var secret_id = name+time;
	secret_id = crypto.createHash('md5').update(secret_id).digest('hex');
	database.query('insert into apps (id, name, secret_id, is_active, created_at) values (default, "'+name+'", "'+secret_id+'", 1, "'+time+'")',function(err) {
		if (err) throw err;
		callback(secret_id);
	});
};

exports.deactivate = function (secret_id, callback) {
	database.query('update apps set is_active = 0 where secret_id = "'+secret_id+'"', function (err, result) {
		if (err) throw err;
		callback(result.affectedRows);
	});
};
