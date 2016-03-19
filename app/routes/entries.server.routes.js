'use strict';

module.exports = function(app) {
	var entries = require('../controllers/entries.server.controller');
	var users = require('../controllers/users.server.controller');

	app.route('/entries')
					.post(users.requiresLogin, entries.bulkcreate);

	app.route('/entries/:entryId')
					.get(entries.read);

	app.route('/resource-entries/:resourceId')
					.get(entries.getByResourceId);
};
