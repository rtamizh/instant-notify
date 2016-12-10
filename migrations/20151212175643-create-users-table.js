var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
	db.createTable('users',{
		id:{type:'int',primaryKey:true, autoIncrement: true },
		name:'string',
		password:'string',
		secret_id:'string',
		app_id:'int',
		socket_id:'string',
		is_active:'boolean',
		is_alive:'boolean',
		last_alive_time:'string',
		created_at:'datetime',
		updated_at:'datetime'
	},callback);
};

exports.down = function(db, callback) {
	db.dropTable('users',callback);
};
