'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	User = mongoose.model('User');

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};
