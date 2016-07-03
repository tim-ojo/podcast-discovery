'use strict';

angular.module('discover').controller('ResourceController', ['$scope', '$stateParams', '$http', 'Resources', '$location', '$anchorScroll', 'Analytics',
	function($scope, $stateParams, $http, Resource, $location, $anchorScroll, Analytics) {
		$scope.selectedEntryId = $stateParams.entryId;
		$scope.resource = Resource.get({id: $stateParams.resourceId});

		Analytics.trackPage('/podcasts/'+$stateParams.resourceId, 'Podcast: ' + $stateParams.resourceId);

		$http.get('/resource-entries/' + $stateParams.resourceId).success(function (response) {
				$scope.entries = response;
				$scope.selectedEntry = $scope.entries.filter(function (entry) {
				  return entry._id === $scope.selectedEntryId;
				})[0];
				//console.log($scope.selectedEntry);
				if ($stateParams.entryId !== undefined)
				{
					Analytics.trackPage('/podcasts/'+ $stateParams.resourceId + '/' +  $stateParams.entryId,
						'Podcast: ' + $scope.resource.title + ' > Episode: ' + $scope.selectedEntry.title);
					$location.hash("episode");
					$anchorScroll();
				}
		});
	}
]);
