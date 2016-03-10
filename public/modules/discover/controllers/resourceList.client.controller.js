'use strict';

angular.module('discover').controller('ResourceListController', ['$scope', '$window',
	function($scope, $window) {
		$scope.screenWidth = $window.innerWidth;
    if ($scope.screenWidth <= 700)
      $scope.descCharCount = 500;
    else
      $scope.descCharCount = 1000;
	}
]);
