'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Entry = mongoose.model('Entry');

/**
 * Unit tests
 */
describe('Entry Model Unit Tests:', function() {
	beforeEach(function(done) {
		done();
	});

	describe('Method Save', function() {
		it('saves a new entry', function(done) {
			var entry = new Entry({
				title: 'First Podcast'
			});

			entry.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('throws a validation error when the title is empty', function(done) {
			var entry = new Entry({
				description: 'First Podcast'
			});

			entry.save(function(err) {
				should.exist(err);
				err.errors.title.message.should.equal('Path `title` is required.');
				done();
			});
		});

		it('throws a validation error for a duplicate enclosure field', function(done) {
			var entry = new Entry({
				title: 'First Podcast',
				enclosure: 'http://domain.com/podcast1.mp3'
			});

			entry.save(function(err) {
				should.not.exist(err);

				var duplicate = new Entry({
					title: 'First Podcast',
					enclosure: 'http://domain.com/podcast1.mp3'
				});

				duplicate.save(function (err){
					should.exist(err);
					err.err.indexOf('duplicate key error').should.not.equal(-1);
					done();
				});
			});
			
		});

	});

	afterEach(function(done) {
		Entry.remove().exec();

		done();
	});
});
