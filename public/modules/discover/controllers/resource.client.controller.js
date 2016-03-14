'use strict';

angular.module('discover').controller('ResourceController', ['$scope', '$stateParams', '$http', 'Resources',
	function($scope, $stateParams, $http, Resource) {
		$scope.selectedEntryId = $stateParams.entryId;
		$scope.resource = Resource.get({id: $stateParams.resourceId});

		$http.get('/resource-entries/' + $stateParams.resourceId).success(function (response) {
				$scope.entries = response;
				$scope.selectedEntry = $scope.entries.filter(function (entry) {
				  return entry._id === $scope.selectedEntryId;
				})[0];
				//console.log($scope.selectedEntry);
				var entryElement = document.getElementById("resource-entry-details");
				entryElement.scrollIntoView(true);
		});
	}
]);
