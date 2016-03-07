'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	mongoosastic = require('mongoosastic'),
	Schema = mongoose.Schema;

/**
 * Topic Schema
 */
var TopicSchema = new Schema({
	topic: {type: String, required: true},
	significance: Number
});

/**
 * Resource Schema
 */
var ResourceSchema = new Schema({
	title: {
		type: String,
		default: '',
		required: true,
		trim: true,
		//es_indexed: true,
		es_boost:2.0
	},
	subtitle: {
		type: String,
		default: '',
		trim: true,
		//es_indexed: true,
		es_boost:2.0
	},
	type: {
		type: String,
		default: '',
		required: true,
		trim: true
	},
	url: {
		type: String,
		default: '',
		required: true,
		trim: true
	},
	artworkUrl: {
		type: String,
		default: '',
		trim: true
	},
	feedUrl: {
		type: String,
		default: '',
		required: true,
		trim: true,
		unique: true
	},
	description: {
		type: String,
		default: '',
		trim: true,
		//es_indexed: true
	},
	lastPublishDate: {
		type: Date,
	},
	authors: {
		type: [String],
		default: []//,
		// es_indexed: true,
		// es_type: 'nested',
		// es_include_in_parent: true
	},
	topics: {
		type: [TopicSchema],
		//es_indexed: true,
		//es_type: 'nested',
		//es_include_in_parent: true
	},
	createdBy: {
		type: Schema.Types.ObjectId
	},
	createdOn: {
		type: Date,
		default: Date.now
	},
	lastModifiedOn: {
		type: Date,
		default: Date.now
	},
	entryCount: {
		type: Number
	}
});

/*
* TODO: I'm duplicating the entire object into elasticsearch for now because I'm not able to make
* mongoosastic properly index arrays of strings/objects. I need to open a GitHub issue and come back
* to fix this.
*/

ResourceSchema.plugin(mongoosastic, {
	index: 'podcast-discovery',
	type: 'resource'
});

mongoose.model('Topic', TopicSchema);
var Res = mongoose.model('Resource', ResourceSchema),
	stream = Res.synchronize();
