'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Entry = mongoose.model('Entry'),
    elasticsearch = require('elasticsearch'),
    errorHandler = require('./errors.server.controller');

var client = new elasticsearch.Client({
  host: 'localhost:9200'
});

function index(entry) {
  // index the doc in elasticsearch
  client.index({
    index: 'podcast-discovery',
    type: 'entry',
    id: entry._id.toString(),
    body: {
      title: entry.title
    }
  });
  // we don't care about failures bcos if it fails the daily indexing process will pick it up
}

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
      index(entry);
      res.status(201).json(entry);
    }
  });
};

/**
 * Create muliple Entries
 */
exports.bulkcreate = function(req, res) {
  var numSaveAttempts = 0;

  req.body.forEach(function (_entry) {
    var entry = new Entry(_entry);
    entry.save(function(err){
      if (!err){
        index(entry);
      }
      if (++numSaveAttempts === req.body.length)
        return res.status(201).send({
          message: 'entries saved'
        });
    });
  });

};

/**
 * Get an Entry By Id
 */
exports.read = function(req, res) {
  Entry.findById(req.params.entryId).exec(function(err, entry){
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
  var entry = req.body;

  Entry.update({_id: req.params.entryId}, entry, {}, function(err, msg){
    if (err) {
			return res.status(400).send({
				message: 'Unable to update document requested'
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
  Entry.findOneAndRemove({_id: req.params.entryId}, {}, function(err, doc, result){
    if (err) {
			return res.status(400).send({
				message: 'Unable to remove document requested'
			});
		} else {
			res.json(doc);
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

/**
 * List of Entries belonging to a resource
 */
exports.getByResourceId = function(req, res) {
  Entry.find({ resourceId: req.params.resourceId }).exec(function(err, entry){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(entry.sort(  function(a, b){
        return (new Date(b.pubDate)) - (new Date(a.pubDate));
      }));
    }
  });
};
