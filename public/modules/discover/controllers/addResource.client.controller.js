'use strict';

angular.module('discover').controller('AddResourceController', ['$scope', 'Resources', '$state', '$stateParams', 'Authentication',
	function($scope, Resource, $state, $stateParams, auth) {
		$scope.resource = new Resource();

    // resource type options
    $scope.resourceTypes = [{id: 'podcast-audio', name: 'podcast-audio'}, {id: 'podcast-video', name: 'podcast-video'}];
    $scope.selectedResourceType = $scope.resourceTypes[0];
    $scope.resource.type = $scope.selectedResourceType.name;

    // defaults
    $scope.resource.createdBy = auth.user._id;

		$scope.getRss = function(){
			console.log($scope.resource.feedUrl);
		};

    $scope.addResource = function(){

      // parse topics and authors if available
      if ($scope.authors && $scope.authors.length > 0){
        $scope.resource.authors = $scope.authors.split(',');
      }

      if ($scope.topics && $scope.topics.length > 0){
        $scope.resource.topics = [];
        $scope.topics.split(',').forEach(function(topic){
          if (topic.length > 0)
          {
            var newTopic = {
              topic: topic.toLowerCase(),
              significance: 0.9
            };
            $scope.resource.topics.push(newTopic);
          }
        });
      }

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
