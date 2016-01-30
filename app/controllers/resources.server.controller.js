'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Resource = mongoose.model('Resource'),
  errorHandler = require('./errors.server.controller'),
    _ = require('lodash');

/**
 * Create a Resource
 */
exports.create = function(req, res) {
  var resource = new Resource(req.body);

  resource.save(function(err){
    if (err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.status(201).json(resource);
    }
  });
};

/**
 * Get a Resource by Id
 */
exports.read = function(req, res) {
  Resource.findById(req.param.resourceId).exec(function(err, resource){
    if (err)
    {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (!resource) {
        return res.status(404).send({
          message: 'Resource not found'
        });
      }
      res.json(resource);
    }
  });
};

/**
 * Update a Resource
 */
exports.update = function(req, res) {
  var resource = req.resource;

  resource = _.extend(resource, req.body);

  resource.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(resource);
		}
	});
};

/**
 * Delete a Resource
 */
exports.delete = function(req, res) {
  var resource = req.resource;

	resource.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(resource);
		}
	});
};

/**
 * List of Resources
 */
exports.list = function(req, res) {
  Resource.find().exec(function(err, resources){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(resources);
    }
  });
};
