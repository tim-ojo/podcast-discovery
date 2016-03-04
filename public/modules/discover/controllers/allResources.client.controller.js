'use strict';

angular.module('discover').controller('AllResourcesController', ['$scope', 'Resources', '$http',
	function($scope, Resource, $http) {
		//$scope.resources = Resource.query();

		$scope.getResources = function () {
        $http.get('/resourceList/' + $scope.currentPage).success(function (response) {
            $scope.resources = response;
        });

				$http.get('/resourcesCount').success(function (response) {
            $scope.totalItems = response.count;
        });
    };

		// Pagination
		$scope.totalItems = 50; // init value
		$scope.currentPage = 1;

		$scope.setPage = function (pageNo) {
		    $scope.currentPage = pageNo;
		};

		$scope.pageChanged = function () {
		    $scope.getResources();
		};
	}
]);
