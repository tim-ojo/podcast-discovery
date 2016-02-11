'use strict';

angular.module('discover').controller('AllResourcesController', ['$scope', 'Resources', '$state', '$stateParams',
	function($scope, Resource, $state, $stateParams, auth) {
		$scope.resources = Resource.query();
	}
]);
