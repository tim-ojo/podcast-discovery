'use strict';

module.exports = function(app) {
	var search = require('../controllers/search.server.controller');

	app.route('/search')
					.get(search.search);

};
