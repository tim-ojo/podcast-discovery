'use strict';

angular.module('discover').controller('AddResourceController', ['$scope', 'Resources', '$state', '$stateParams', 'Authentication',
	function($scope, Resource, $state, $stateParams, auth) {
		$scope.resource = new Resource();

    // resource type options
    $scope.resourceTypes = [{id: 'podcast-audio', name: 'podcast-audio'}, {id: 'podcast-video', name: 'podcast-video'}];
    $scope.selectedResourceType = $scope.resourceTypes[0];
    $scope.resource.type = $scope.selectedResourceType.name;

    // parse topics and authors if available
    //TODO

    // defaults
    $scope.resource.createdBy = auth.user._id;

    $scope.addResource = function(){
      $scope.resource.$save(function(resp, headers){
        $state.go('home'); // TODO: redirect this to the right place later
      },
      function(err){
        $scope.errorState = true;
        //console.log(err);
      }
    );
    };
	}
]);
