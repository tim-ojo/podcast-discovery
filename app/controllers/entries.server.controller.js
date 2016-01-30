'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Entry = mongoose.model('Entry'),
    errorHandler = require('./errors.server.controller'),
    _ = require('lodash');

/**
 * Create an Entry
 */
exports.create = function(req, res) {
  var entry = new Entry(req.body);

  entry.save(function(err){
    if (err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.status(201).json(entry);
    }
  });
};

/**
 * Get an Entry By Id
 */
exports.read = function(req, res) {
  Entry.findById(req.param.entryId).exec(function(err, entry){
    if (err)
    {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (!entry) {
        return res.status(404).send({
          message: 'Resource not found'
        });
      }
      res.json(entry);
    }
  });
};

/**
 * Update an Entry
 */
exports.update = function(req, res) {
  var entry = req.entry;

  entry = _.extend(entry, req.body);

  entry.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(entry);
		}
	});
};

/**
 * Delete an Entry
 */
exports.delete = function(req, res) {
  var entry = req.entry;

	entry.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(entry);
		}
	});
};

/**
 * List of Entries
 */
exports.list = function(req, res) {
  Entry.find().exec(function(err, entry){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(entry);
    }
  });
};
