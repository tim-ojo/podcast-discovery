'use strict';

/**
 * Module dependencies.
 */
var glob = require('glob'),
	chalk = require('chalk');

/**
 * Module init function.
 */
module.exports = function() {
	/**
	 * Before we begin, lets set the environment variable
	 * We'll Look for a valid NODE_ENV variable and if one cannot be found load the development NODE_ENV
	 */
	var environmentFiles = glob.sync('./config/env/' + process.env.NODE_ENV + '.js');
  	console.log();
  	if (!environmentFiles.length) {
    	if (process.env.NODE_ENV) {
    	  console.error(chalk.red('+ Error: No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead'));
    	} else {
      		console.error(chalk.red('+ Error: NODE_ENV is not defined! Using default development environment'));
    	}
    	process.env.NODE_ENV = 'development';
  	}
  	// Reset console color
	console.log(chalk.white(''));

};
