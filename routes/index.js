/* jshint node: true */
'use strict';
var express = require('express');
var router = express.Router();
var AppController = require('../controllers/app_controller.js');
var UserController = require('../controllers/user_controller.js');
var NotificationController = require('../controllers/notification_controller.js');
var LogController = require('../controllers/log_controller.js');

//	create notification application (to handle multiple application)
router.post('/app/create', function  (req,res) {
	AppController.create(req, res);
});

//	deactivate the application
router.post('/app/deactivate', function (req, res) {
	AppController.deactivate(req, res);
});

//	create user for specific application
router.post('/app/user/create',function  (req,res) {
	UserController.create(req, res);
});

router.post('/user/deactivate', function (req, res) {
	UserController.deactivate(req, res);
});

router.post('/user/secret/update', function (req,res) {
	UserController.updateSecret(req, res);
});

router.post('/user/secret/get', function (req, res) {
	UserController.getSecretByCredentials(req,res);
});

// create notification for user
router.post('/app/notification/create',function  (req, res) {
	NotificationController.create(req, res);
});

router.post('/user/log', function (req, res) {
	LogController.create(req, res);
})

module.exports = router;
