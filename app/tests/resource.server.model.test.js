'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Resource = mongoose.model('Resource');

/**
 * Globals
 */
var resource;

/**
 * Unit tests
 */
describe('Resource Model Unit Tests:', function() {
	beforeEach(function(done) {
		done();
	});

	describe('Method Save', function() {
		it('saves a new resource', function(done) {
			done();
		});

		it('throws a validation error when the title is empty');

		it('throws a validation error when the url is empty');

		it('throws a validation error when the feedUrl is empty');

		it('throws a validation error when the type is empty');

		it('throws a validation error for a duplicate resource');

	});

	afterEach(function(done) {
		Resource.remove().exec(); // Do I want to do this?

		done();
	});
});
