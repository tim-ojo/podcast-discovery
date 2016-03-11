'use strict';

angular.module('discover').controller('SearchResultsController', ['$scope', '$state', '$stateParams', '$http',
	function($scope, $state, $stateParams, $http) {
		
		$scope.getSearchResults = function () {
      if ($stateParams.query !== null)
      {
        $http.get('/search?q=' + $stateParams.query).success(function (response) {
            $scope.items = response;
        });

        $scope.query = $stateParams.query;
      }
    };

    $scope.execSearch = function(){
			$state.go('search', {'query': $scope.query});
		};

		// Pagination
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.offset = 0;
		//$scope.totalItems = 100; // init value

		$scope.pageChanged = function () {
		    $scope.offset = ($scope.currentPage - 1) * $scope.pageSize;
		};
	}
]);
