/* jshint node: true */
'use strict';
var database = require('../config/database.js');

exports.create = function (data,callback) {
	var time = (new Date()).getTime();
	var query = 'insert into logs (id, user_id, app_id, action, message, online, created_at, updated_at) values (default,"'+data.user_id+'","'+data.app_id+'","'+data.action+'"';
	if (data.message) {
		query += '","'+data.message+'"';
	}else{
		query += ',NULL'
	}
	query += ',1,NOW(),NOW())';
	database.query(query,function  (err, row) {
		if (err) throw err;
		if (callback) {
			callback(true)
		}
	});
}