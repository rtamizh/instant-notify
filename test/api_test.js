var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
process.env.NODE_ENV = 'test';
process.env.SECRET_KEY = process.env.TEST_SECRET_KEY;
var database = require('../config/database.js');

var test_variables = {}

it('should truncate all tables', function (done) {
	database.query('truncate table user_socket_ids', function () {
		database.query('truncate table notifications', function () {
			database.query('truncate table users', function () {
				database.query('truncate table apps', function () {
					done();
				});
			});	
		});
	});	
})

chai.use(chaiHttp);

it('should return incorrect secret code', function (done) {
	chai.request(server)
		.post('/api/app/create')
		.send({'name': 'testing'})
		.end(function(err, res) {
			res.should.have.status(200);
			res.body.should.have.property('error_code').eql(25);
			done();
		})
})

it('should add a app', function (done) {
	chai.request(server)
		.post('/api/app/create')
		.send({'name': 'testing', 'secret_key': process.env.TEST_SECRET_KEY})
		.end(function (err, res) {
			res.should.have.status(200);
      		res.body.should.have.property('app_secret');
      		test_variables.app_secret = res.body.app_secret;
      		done();
		})
})

it('should return name already registered', function (done) {
	chai.request(server)
		.post('/api/app/create')
		.send({'name': 'testing', 'secret_key': process.env.TEST_SECRET_KEY})
		.end(function (err, res) {
			res.should.have.status(200);
			res.body.should.have.property('error_code').eql(10);
			done();
		})
})

it('should add a user', function (done) {
	chai.request(server)
		.post('/api/user/create')
		.send({'name': 'john doe', 'password': 'Password', 'app_secret': test_variables.app_secret})
		.end(function (err, res) {
			res.should.have.status(200);
			res.body.should.have.property('user_secret');
			test_variables.user_secret = res.body.user_secret;
			done();
		})
})

it('should deactivate the user', function(done){
	chai.request(server)
		.post('/api/user/deactivate')
		.send({'app_secret': test_variables.app_secret, 'user_secret': test_variables.user_secret})
		.end(function (err, res){
			res.should.have.status(200);
			res.body.should.have.property('message').eql('success');
			done();
		})
})

it('should not return secret for inactive user', function(done){
	chai.request(server)
		.post('/api/user/secret/get')
		.send({'name': 'john doe', 'password': 'Password', 'app_secret': test_variables.app_secret})
		.end(function(err, res){
			res.should.have.status(200);
			res.body.should.have.property('error_code').eql(13);
			done();
		})
})

it('should activate the user', function(done){
	chai.request(server)
		.post('/api/user/activate')
		.send({'app_secret': test_variables.app_secret, 'user_secret': test_variables.user_secret})
		.end(function(err, res){
			res.should.have.status(200);
			res.body.should.have.property('message').eql('success');
			done();
		})
})

it('should return the user secret', function(done){
	chai.request(server)
		.post('/api/user/secret/get')
		.send({'name': 'john doe', 'password': 'Password', 'app_secret': test_variables.app_secret})
		.end(function(err, res){
			res.should.have.status(200);
			res.body.should.have.property('user_secret');
			done();
		})
})

it('should update the user secret', function(done){
	chai.request(server)
		.post('/api/user/secret/update')
		.send({'app_secret': test_variables.app_secret, 'user_secret': test_variables.user_secret})
		.end(function(err, res){
			res.should.have.status(200);
			res.body.should.have.property('user_secret').not.eql(test_variables.user_secret);
			test_variables.user_secret = res.body.user_secret;
			done();
		})
})

it('should create notification to a user', function (done) {
	chai.request(server)
		.post('/api/notification/create')
		.send({'app_secret': test_variables.app_secret, 'user_secret': test_variables.user_secret})
		.end(function (err, res) {
			res.should.have.status(200);
			res.body.should.have.property('message').eql('success');
			done();
		})
})

it('should create a log', function (done) {
	chai.request(server)
		.post('/api/log/create')
		.send({'app_secret': test_variables.app_secret, 'user_secret': test_variables.user_secret, 'action': 'testing'})
		.end(function (err, res) {
			res.should.have.status(200);
			res.body.should.have.property('message').eql('success');
			done();
		})
})

it('should get log for a user', function (done) {
	chai.request(server)
		.post('/api/log/get')
		.send({'app_secret': test_variables.app_secret, 'user_secret': test_variables.user_secret, 'action': 'testing'})
		.end(function (err, res) {
			res.should.have.status(200);
			res.body.should.have.property('message').eql('success');
			done();
		})
})
