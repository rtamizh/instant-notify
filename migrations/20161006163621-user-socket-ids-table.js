var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('user_socket_ids', {
  	socket_id: 'string',
  	user_id: 'int'
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('user_socket_ids', callback);
};
