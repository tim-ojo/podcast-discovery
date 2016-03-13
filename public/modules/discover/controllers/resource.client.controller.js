'use strict';

angular.module('discover').controller('ResourceController', ['$scope', '$stateParams', '$http', 'Resources',
	function($scope, $stateParams, $http, Resource) {
		$scope.resource = Resource.get({id: $stateParams.resourceId});

		$http.get('/resource-entries/' + $stateParams.resourceId).success(function (response) {
				$scope.entries = response;
				console.log(response);
		});
	}
]);
