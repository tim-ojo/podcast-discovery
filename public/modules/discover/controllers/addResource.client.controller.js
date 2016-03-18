'use strict';

angular.module('discover').controller('AddResourceController', ['$scope', 'Resources', '$state', '$stateParams', 'Authentication', '$window',
	function($scope, Resource, $state, $stateParams, auth, $window) {
		$scope.resource = new Resource();

    // resource type options
		/*
    $scope.resourceTypes = [{id: 'podcast-audio', name: 'podcast-audio'}, {id: 'podcast-video', name: 'podcast-video'}];
    $scope.selectedResourceType = $scope.resourceTypes[0];
    $scope.resource.type = $scope.selectedResourceType.name;
		*/

    // defaults
    $scope.resource.createdBy = auth.user._id;

		$scope.getRss = function(){
			console.log($scope.resource.feedUrl);
			$window.feednami.load($scope.resource.feedUrl, function(result){
		    if(result.error){
		      console.log(result.error);
		    }
		    else{
		      var meta = result.feed.meta;
		      console.log(meta);

					$scope.resource.title = meta.title;
					$scope.resource.subtitle = meta['itunes:subtitle']['#'];
					$scope.resource.type = 'podcast-audio';
					$scope.resource.url = meta.link;
					$scope.resource.description = meta.description;
					$scope.authors = meta.author;
					$scope.topics = meta.categories.join(', ');
					$scope.resource.artworkUrl = meta.image.url;
					$scope.resource.lastPublishDate = meta.pubDate;

					$scope.$apply();
		    }
		  });
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

      $scope.resource.$save(function(created, headers){
				$state.go('podcast', {'resourceId': created._id});
				//TODO; Go ahead and create the entries and send them as well
				//TODO: On the server side be sure to index them in Elasticsearch
      },
      function(err){
        $scope.errorState = true;
        //console.log(err);
      }
    );
    };
	}
]);
