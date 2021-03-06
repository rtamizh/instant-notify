var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
	db.createTable('notifications',{
		id:{type:'int',primaryKey:true, autoIncrement: true },
		user_id:'int',
		is_notified:'boolean',
		text:'string',
		image:'string',
		notification_link_url:'string',
		created_at:'datetime',
		updated_at:'datetime'
	},callback);
};

exports.down = function(db, callback) {
 	db.dropTable('notifications',callback);
};
