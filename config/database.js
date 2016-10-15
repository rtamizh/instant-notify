var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME
});

// create database connection 
connection.connect(function  (err) {
	if (err) throw err;
	console.log('database connected');
});

module.exports = connection;
