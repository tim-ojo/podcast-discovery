'use strict';

// Setting up route
angular.module('discover').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
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
		;

	}
]);
