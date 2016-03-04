'use strict';

module.exports = function(app) {
	var resources = require('../controllers/resources.server.controller');
	var users = require('../controllers/users.server.controller');

	app.route('/resources')
					.get(resources.list)
					.post(users.requiresLogin, resources.create);
					//.post(resources.create);

	app.route('/resources/:resourceId')
					.get(resources.read)
					.put(users.requiresLogin, resources.update)
					.delete(users.requiresLogin, resources.delete);
					//.put(resources.update)
					//.delete(resources.delete);

	app.route('/resourcesCount')
					.get(resources.count);

	app.route('/resourceList/:page')
					.get(resources.resourceList);
};
