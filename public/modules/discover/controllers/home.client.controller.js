'use strict';

angular.module('discover').controller('HomeController', ['$scope', '$state', 'Authentication',
	function($scope, $state, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.execSearch = function(){
			$state.go('search', {'query': $scope.query});
		};
	}
]);
