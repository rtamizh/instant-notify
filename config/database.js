var mysql      = require('mysql');
if (process.env.NODE_ENV != 'test') {
	var connection = mysql.createConnection({
		host     : process.env.DB_HOST,
		user     : process.env.DB_USER,
		password : process.env.DB_PASS,
		database : process.env.DB_NAME
	});
} else {
	var connection = mysql.createConnection({
		host     : process.env.TEST_DB_HOST,
		user     : process.env.TEST_DB_USER,
		password : process.env.TEST_DB_PASS,
		database : process.env.TEST_DB_NAME
	});
}

// create database connection 
connection.connect(function  (err) {
	if (err) throw err;
});

module.exports = connection;
