'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
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
		trim: true
	},
	subtitle: {
		type: String,
		default: '',
		trim: true
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
		trim: true
	},
	lastPublishDate: {
		type: Date,
	},
	authors: {
		type: [String],
		default: [],
	},
	topics: {
		type: [TopicSchema]
	},
	createdBy: {
		type: String,
		default: '',
		trim: true
	},
	createdOn: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Topic', TopicSchema);
mongoose.model('Resource', ResourceSchema);
