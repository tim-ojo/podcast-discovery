'use strict';

angular.module('discover').controller('ResourceController', ['$scope', '$stateParams', '$http', 'Resources', '$location', '$anchorScroll',
	function($scope, $stateParams, $http, Resource, $location, $anchorScroll) {
		$scope.selectedEntryId = $stateParams.entryId;
		$scope.resource = Resource.get({id: $stateParams.resourceId});

		$http.get('/resource-entries/' + $stateParams.resourceId).success(function (response) {
				$scope.entries = response;
				$scope.selectedEntry = $scope.entries.filter(function (entry) {
				  return entry._id === $scope.selectedEntryId;
				})[0];
				//console.log($scope.selectedEntry);
				if ($stateParams.entryId !== undefined)
				{
					$location.hash("episode");
					$anchorScroll();
				}
		});
	}
]);
