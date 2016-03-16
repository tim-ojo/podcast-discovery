'use strict';

// Setting up route
angular.module('discover').config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
	function($stateProvider, $urlRouterProvider, $httpProvider) {
		// enable http caching
		$httpProvider.defaults.cache = true;

		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		function authenticate ($q, $state, $timeout, Authentication){
			if (Authentication.user) {
				return $q.when();
			} else {
				$timeout(function() {
          $state.go('loginPage');
        });
				return $q.reject();
			}
		}

		// Home state routing
		$stateProvider
		.state('home', {
			url: '/',
			templateUrl: 'modules/discover/views/home.client.view.html'
		})
		.state('loginPage', {
			url: '/login',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		})
		.state('new', {
			url: '/new',
			templateUrl: 'modules/discover/views/addResource.client.view.html',
			resolve: {authenticate: authenticate}
		})
		.state('all_podcasts', {
			url: '/podcasts',
			templateUrl: 'modules/discover/views/allResources.client.view.html'
		})
		.state('search', {
			url: '/search?query',
			templateUrl: 'modules/discover/views/searchResults.client.view.html',
			params: {
				query: {
					value: '',
					squash: true
				}
			}
		})
		.state('podcast', {
			url: '/podcasts/:resourceId',
			templateUrl: 'modules/discover/views/resource.client.view.html'
		})
		.state('podcast_entry', {
			url: '/podcasts/:resourceId/:entryId',
			templateUrl: 'modules/discover/views/resource.client.view.html'
		})
		.state('tags', {
			url: '/podcasts/tags',
			templateUrl: 'modules/discover/views/topics.client.view.html'
		})
		;

	}
]);
