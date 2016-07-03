'use strict';

angular.module('discover').controller('HomeController', ['$scope', '$state', 'Authentication', 'Analytics',
	function($scope, $state, Authentication, Analytics) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		Analytics.trackPage('/', 'home');

		$scope.execSearch = function(){
			$state.go('search', {'query': $scope.query});
		};
	}
]);
