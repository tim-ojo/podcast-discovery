'use strict';

angular.module('discover').controller('AddResourceController', ['$scope', 'Resources', '$state', 'Authentication', '$window', '$http',
	function($scope, Resource, $state, auth, $window, $http) {
		$scope.resource = new Resource();

    // defaults
    $scope.resource.createdBy = auth.user._id;

		$scope.getRss = function(){
			$window.feednami.load($scope.resource.feedUrl, function(result){
		    if(result.error){
		      console.log(result.error);
		    }
		    else{
		      var meta = result.feed.meta;
		      $scope.feedentries = result.feed.entries;

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
              topic: topic.toLowerCase().trim(),
              significance: 0.9
            };
            $scope.resource.topics.push(newTopic);
          }
        });
      }

      $scope.resource.$save(function(created, headers){
				$state.go('podcast', {'resourceId': created._id});

				var entries = $scope.feedentries.map(function (entry) {
					var rEntry = {
						title: entry.title,
						resourceId: created._id,
						url: entry.link,
						enclosure: entry.enclosures[0].url,
						pubDate: entry.date,
						description: entry.summary,
						authors: [entry.author]
					};

					return rEntry;
				});

				$http.post('/entries', entries);
      },
      function(err){
        $scope.errorState = true;
        //console.log(err);
      }
    );
    };
	}
]);
