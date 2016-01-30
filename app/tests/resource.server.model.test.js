'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Resource = mongoose.model('Resource');

/**
 * Unit tests
 */
describe('Resource Model Unit Tests:', function() {
	beforeEach(function(done) {
		done();
	});

	describe('Method Save', function() {
		it('saves a new resource', function(done) {
			var podcast = new Resource({
				title: '.Net Rocks',
				subtitle: '.NET Rocks! is an Internet Audio Talk Show for Microsoft .NET Developers.',
				type: 'podcast-audio',
				url: 'http://www.dotnetrocks.com',
				feedUrl: 'http://www.pwop.com/feed.aspx?show=dotnetrocks&filetype=master',
				authors: ['Carl Franklin', 'Richard Campbell'],
				topics: [{topic: 'C#'}, {topic:'ASP .Net'}],
				createdBy: 'Tim Ojo'
			});

			podcast.save(function(err, saved) {
                should.not.exist(err);
                done();
            });
		});

		it('throws a validation error when the title is empty', function(done){
			var resource = new Resource({
				createdBy: 'Tim Ojo'
			});

			resource.save(function(err) {
				should.exist(err);
				err.errors.title.message.should.equal('Path `title` is required.');
				done();
			});
		});

		it('throws a validation error when the url is empty', function(done){
			var resource = new Resource({
				createdBy: 'Tim Ojo'
			});

			resource.save(function(err) {
				should.exist(err);
				err.errors.url.message.should.equal('Path `url` is required.');
				done();
			});
		});

		it('throws a validation error when the feedUrl is empty', function(done){
			var resource = new Resource({
				createdBy: 'Tim Ojo'
			});

			resource.save(function(err) {
				should.exist(err);
				err.errors.feedUrl.message.should.equal('Path `feedUrl` is required.');
				done();
			});
		});

		it('throws a validation error when the type is empty', function(done){
			var resource = new Resource({
				createdBy: 'Tim Ojo'
			});

			resource.save(function(err) {
				should.exist(err);
				err.errors.type.message.should.equal('Path `type` is required.');
				done();
			});
		});

		it('throws a validation error for a duplicate resource (by feedUrl)', function(done){
			var podcast = new Resource({
				title: '.Net Rocks',
				type: 'podcast-audio',
				url: 'http://www.dotnetrocks.com',
				feedUrl: 'http://www.pwop.com/feed.aspx?show=dotnetrocks&filetype=master'
			});

			podcast.save(function (err) {
				should.not.exist(err);

				var duplicate = new Resource({
					title: '.Net Rocks',
					type: 'podcast-audio',
					url: 'http://www.dotnetrocks.com',
					feedUrl: 'http://www.pwop.com/feed.aspx?show=dotnetrocks&filetype=master'
				});

				duplicate.save(function(err){
					should.exist(err);
					err.err.indexOf('duplicate key error').should.not.equal(-1);

					done();
				});
			});

		});

	});

	afterEach(function(done) {
		Resource.remove().exec(); // Do I want to do this?

		done();
	});
});
