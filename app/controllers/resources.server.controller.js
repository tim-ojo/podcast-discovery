'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Resource = mongoose.model('Resource'),
  elasticsearch = require('elasticsearch'),
  striptags = require('striptags'),
  errorHandler = require('./errors.server.controller'),
  config = require('../../config/config'),
  MongoClient = require('mongodb').MongoClient,
  mongodb,
  filteredTopics = ['technology', 'technology/software how-to', 'technology/tech news', 'technology/podcasting', 'technology/gadgets'];

MongoClient.connect(config.db, function(err, mongoclient) {
  if (!err) {
		mongodb = mongoclient.db(config.db.split('/').pop());
	}
});

var client = new elasticsearch.Client({
  host: config.esURL
});

function isNotInNaughtyList(topic){
  if (filteredTopics.indexOf(topic) === -1)
    return true;
  else
    return false;
}

function getTopics(topicObject){
  return topicObject.topic;
}

function index(resource) {
  // index the doc in elasticsearch
  client.index({
    index: 'podcast-discovery',
    type: 'resource',
    id: resource._id.toString(),
    body: {
      title: resource.title,
      subtitle: resource.subtitle,
      description: resource.description,
      authors: resource.authors,
      topics: resource.topics.map(getTopics).filter(isNotInNaughtyList)
    }
  });
  // we don't care about failures bcos if it fails the daily indexing process will pick it up
}

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
      index(resource);
      res.status(201).json(resource);
    }
  });
};

/**
 * Get a Resource by Id
 */
exports.read = function(req, res) {
  Resource.findById(req.params.resourceId).exec(function(err, resource){
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
  var resource = req.body;

  Resource.update({_id: req.params.resourceId}, resource, {}, function(err, msg){
    if (err) {
			return res.status(400).send({
				message: 'Unable to update document requested'
			});
		} else {
      index(resource);
			res.json(resource);
		}
  });
};

/**
 * Delete a Resource
 */
exports.delete = function(req, res) {
  Resource.findOneAndRemove({_id: req.params.resourceId}, {}, function(err, doc, result){
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
 * List of Resources
 */
exports.list = function(req, res) {
  Resource.find().exec(function(err, resources){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      resources.forEach(function(resource){ resource.subtitle = striptags(resource.subtitle); });
      res.json(resources);
    }
  });
};

/**
 * List of Resources
 */
exports.resourceList = function(req, res) {
  var page = 1;
  if(!req.params.page) {
      page = 1;
  } else {
    page = req.params.page;
  }
  var per_page = 50;

  Resource.find().sort('title').skip((page-1)*per_page).limit(per_page).exec(function(err, resources){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      resources.forEach(function(resource){ resource.subtitle = striptags(resource.subtitle); });
      res.json(resources);
    }
  });
};

/**
 * Total Count of Resources
 */
exports.count = function(req, res) {
  Resource.count().exec(function(err, val){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json({count : val});
    }
  });
};


exports.topicList = function(req, res) {
  var cursor = mongodb.collection('cache').find({ "key": "top-100-topics" });
  cursor.each(function (err, doc){
    if (err) {
      return res.status(400).send({
        message: err.err
      });
    } else {
      if (doc === null)
        return res.json({});
      else
        return res.json(doc);
    }
  });
};
