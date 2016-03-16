'use strict';

angular.module('discover').controller('AllResourcesController', ['$scope', 'Resources', '$http', '$window',
	function($scope, Resource, $http, $window) {
		//$scope.items = Resource.query();
		$scope.enableFilter = true;

		$scope.getResources = function () {
        $http.get('/resource-list/' + $scope.currentPage).success(function (response) {
            $scope.items = response;
						$window.scrollTo(0, 0);
        });

				$http.get('/resources-count').success(function (response) {
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
