'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Entry Schema
 */
var EntrySchema = new Schema({
	title: {
		type: String,
		required: true
	},
	resourceId: Schema.Types.ObjectId,
	url: String,
	enclosure: {
		type: String,
		unique: true
	},
	pubDate: Date,
	description: String,
	authors: [String],
	topics: []
});

mongoose.model('Entry', EntrySchema);
