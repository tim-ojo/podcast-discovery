'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	mongoosastic = require('mongoosastic'),
	Schema = mongoose.Schema;

/**
 * Entry Schema
 */
var EntrySchema = new Schema({
	title: {
		type: String,
		required: true,
		// es_indexed: true,
		es_boost:2.0
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
	topics: {
		type: [String]//,
		// es_indexed: true,
		// es_type: 'nested',
		// es_include_in_parent: true
	}
});

EntrySchema.plugin(mongoosastic, {
	index: 'podcast-discovery',
	type: 'entry'
});

var Entry = mongoose.model('Entry', EntrySchema),
	stream = Entry.synchronize();
