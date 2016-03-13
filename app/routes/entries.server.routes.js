'use strict';

module.exports = function(app) {
	var entries = require('../controllers/entries.server.controller');

	//app.route('/entries')
	//				.get(entries.list);

	app.route('/entries/:entryId')
					.get(entries.read);

	app.route('/resource-entries/:resourceId')
					.get(entries.getByResourceId);
};
