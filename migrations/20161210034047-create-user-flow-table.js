var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
	db.createTable('logs', {
		id:{type:'int',primaryKey:true, autoIncrement: true },
		user_id: 'int',
		app_id: 'int',
		action: 'string',
		message: 'text',
		online: 'boolean',
		created_at: 'datetime',
		updated_at: 'datetime'
	}, callback)
};

exports.down = function(db, callback) {
  db.dropTable('logs',callback);
};
