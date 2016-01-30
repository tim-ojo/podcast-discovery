'use strict';

module.exports = function(app) {
	var resources = require('../controllers/resources.server.controller');

	app.route('/resources')
					.get(resources.list)
					.post(resources.create);

	app.route('/resources/:resourceId')
					.get(resources.read)
					.put(resources.update)
					.delete(resources.delete);
};
