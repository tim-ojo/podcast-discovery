'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	url = require('url'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	config = require('../config'),
	users = require('../../app/controllers/users.server.controller');

module.exports = function() {
	//Use google strategy
	passport.use(new GoogleStrategy({
			clientID: config.google.clientID,
			clientSecret: config.google.clientSecret,
			callbackURL: config.google.callbackURL,
			passReqToCallback: true
	},
	function (req, accessToken, refreshToken, profile, done) {
		// make the code asynchronous
    // User.findOne won't fire until we have all our data back from Google
		process.nextTick(function() {
			var googleUserProfile = {
				id: profile.id,
				token: accessToken,
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				displayName: profile.displayName,
				email: profile.emails[0].value
			};

			users.saveGoogleUser(req, googleUserProfile, done);
		});
	}
	));
};
