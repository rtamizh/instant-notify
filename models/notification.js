/* jshint node: true */
'use strict';
var database = require('../config/database.js');


exports.create = function  (data,callback) {
	var time = (new Date()).getTime();
	database.query('insert into notifications (id,user_id,is_notified,text,image,notification_link_url,created_at, updated_at) values (default,"'+data.user_id+'",default,"'+data.text+'","'+data.image+'","'+data.notification_link+'",NOW(), NOW())',function  (err, row) {
		if (err) throw err;
		callback(row);
	});
};

exports.getNotification = function  (data,callback) {
	database.query('select text,image,notification_link_url,created_at as time from notifications where user_id = "'+data.secret_id+'" order by created_at asc limit '+data.count+'',function  (err,rows) {
		if (err) throw err;
		callback(rows);
	});
};
