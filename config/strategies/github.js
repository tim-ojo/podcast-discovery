'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	url = require('url'),
	GithubStrategy = require('passport-github').Strategy,
	config = require('../config'),
	users = require('../../app/controllers/users.server.controller');

module.exports = function() {
	// Use github strategy
	passport.use(new GithubStrategy({
			clientID: config.github.clientID,
			clientSecret: config.github.clientSecret,
			callbackURL: config.github.callbackURL,
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {
			process.nextTick(function() {
				var githubUserProfile = {
					id: profile.id,
					token: accessToken,
					displayName: profile.displayName,
					email: profile.emails[0].value
				};

				users.saveGithubUser(req, githubUserProfile, done);
			});
		}
	));
};
