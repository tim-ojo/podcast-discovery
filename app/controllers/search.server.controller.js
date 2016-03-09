'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    elasticsearch = require('elasticsearch'),
    striptags = require('striptags'),
    Entry = mongoose.model('Entry'),
    Resource = mongoose.model('Resource'),
    errorHandler = require('./errors.server.controller');

var client = new elasticsearch.Client({
  host: 'localhost:9200'
});

/**
 * search for both podcasts and entries
 */
exports.search = function(req, res) {

  client.search({
    index: 'podcast-discovery',
    size: 100,
    body: {
      query: {
        query_string: {
          query: req.query.q,
          fields: ['_all', 'title^3']
        }
      }
    }
  }).then(function(resp) {
    var results = [],
        mongoed = 0;

    var hits = resp.hits.hits;
    hits.forEach(function(hit){
      var resObj = {
        _id: hit._id,
        artworkUrl: '',
        title: hit._source.title,
        type: hit._type,
        description: '',
        publishDate: '',
        authors : ''
      };

      results.push(resObj);

      if (hit._type === 'entry')
      {
        Entry.findById(hit._id).exec(function(err, entry){
          if (!err) {
            if (entry) {
              resObj.description = striptags(entry.description);
              resObj.publishDate = entry.pubDate;
              resObj.authors = entry.authors;

              Resource.findById(entry.resourceId).exec(function(err, resource){
                if (!err) {
                  if (resource) {
                    resObj.artworkUrl = resource.artworkUrl;

                    if (++mongoed === hits.length) {
                      res.json(results);
                    }
                  }
                }
              });

            }
          }
        });
      }
      else if (hit._type === 'resource')
      {
        Resource.findById(hit._id).exec(function(err, resource){
          if (!err) {
            if (resource) {
              resObj.description = striptags(resource.description);
              resObj.publishDate = resource.lastPublishDate;
              resObj.authors = resource.authors;
              resObj.artworkUrl = resource.artworkUrl;

              if (++mongoed === hits.length) {
                res.json(results);
              }
            }
          }
        });
      }

    });

    //res.json(results);

  }, function(err) {
    return res.status(400).send({
      message: err
    });
  });

};
