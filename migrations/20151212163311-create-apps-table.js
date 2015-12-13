var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('apps',{
  	id:{type:'int' , primaryKey:true},
  	name:'string',
  	secret_id:'string',
  	is_active:'boolean',
  	created_at:'string'
  }, callback)
};

exports.down = function(db, callback) {
  db.dropTable('apps',callback);
};
