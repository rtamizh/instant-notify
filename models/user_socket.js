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

exports.removeSocket = function (data) {
	database.query('delete from user_socket_ids where socket_id = "'+data+'"', function (err) {
		if (err) throw err;
	});
};
