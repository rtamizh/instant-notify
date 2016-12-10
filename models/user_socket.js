/* jshint node: true */
'use strict';
var database = require('../config/database.js');


exports.updateSocketId = function  (data) {
	database.query("insert into user_socket_ids (socket_id, user_id) values ('"+data.socket_id+"', '"+data.user_id+"')", function (err) {
		if (err) throw err;
	});
};

exports.getUserSockets = function (user_id, callback) {
	database.query('select socket_id from user_socket_ids where user_id = "'+user_id+'"', function (err, rows) {
		if (err) throw err;
		callback(rows);
	});
}

exports.getUserBySocket = function (socket_id, callback) {
	database.query('select user_id from user_socket_ids where socket_id = "'+socket_id+'"', function (err, rows) {
		if (err) throw err;
		if (rows.length == 0) callback(null)
		callback(rows[0]);
	})
}

exports.removeSocket = function (data) {
	database.query('delete from user_socket_ids where socket_id = "'+data+'"', function (err) {
		if (err) throw err;
	});
};
