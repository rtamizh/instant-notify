var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
	db.createTable('notifications',{
		id:{type:'int',primaryKey:true},
		user_id:'int',
		is_notified:'boolean',
		text:'string',
		image:'string',
		notification_link_url:'string',
		created_at:'string'
	},callback);
};

exports.down = function(db, callback) {
 	db.dropTable('notifications',callback);
};
