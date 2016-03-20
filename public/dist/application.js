'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'podcast-discovery';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('discover', ['ngResource']);

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
angular.module('discover').config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
	function($stateProvider, $urlRouterProvider, $httpProvider) {
		// enable http caching
		$httpProvider.defaults.cache = true;

		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		function authenticate ($q, $state, $timeout, Authentication){
			if (Authentication.user) {
				return $q.when();
			} else {
				$timeout(function() {
          $state.go('loginPage');
        });
				return $q.reject();
			}
		}

		// Home state routing
		$stateProvider
		.state('home', {
			url: '/',
			templateUrl: 'modules/discover/views/home.client.view.html'
		})
		.state('loginPage', {
			url: '/login',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		})
		.state('new', {
			url: '/new',
			templateUrl: 'modules/discover/views/addResource.client.view.html',
			resolve: {authenticate: authenticate}
		})
		.state('all_podcasts', {
			url: '/podcasts',
			templateUrl: 'modules/discover/views/allResources.client.view.html'
		})
		.state('search', {
			url: '/search?query',
			templateUrl: 'modules/discover/views/searchResults.client.view.html',
			params: {
				query: {
					value: '',
					squash: true
				}
			}
		})
		.state('podcast', {
			url: '/podcasts/:resourceId',
			templateUrl: 'modules/discover/views/resource.client.view.html'
		})
		.state('podcast_entry', {
			url: '/podcasts/:resourceId/:entryId',
			templateUrl: 'modules/discover/views/resource.client.view.html'
		})
		.state('tags', {
			url: '/topics',
			templateUrl: 'modules/discover/views/topics.client.view.html'
		})
		;

	}
]);

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

'use strict';

angular.module('discover').controller('HeaderController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		$scope.authentication = Authentication;

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);

'use strict';

angular.module('discover').controller('HomeController', ['$scope', '$state', 'Authentication',
	function($scope, $state, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.execSearch = function(){
			$state.go('search', {'query': $scope.query});
		};
	}
]);

'use strict';

angular.module('discover').controller('ResourceController', ['$scope', '$stateParams', '$http', 'Resources', '$location', '$anchorScroll',
	function($scope, $stateParams, $http, Resource, $location, $anchorScroll) {
		$scope.selectedEntryId = $stateParams.entryId;
		$scope.resource = Resource.get({id: $stateParams.resourceId});

		$http.get('/resource-entries/' + $stateParams.resourceId).success(function (response) {
				$scope.entries = response;
				$scope.selectedEntry = $scope.entries.filter(function (entry) {
				  return entry._id === $scope.selectedEntryId;
				})[0];
				//console.log($scope.selectedEntry);
				if ($stateParams.entryId !== undefined)
				{
					$location.hash("episode");
					$anchorScroll();
				}
		});
	}
]);

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

'use strict';

angular.module('discover').controller('SearchResultsController', ['$scope', '$state', '$stateParams', '$http',
	function($scope, $state, $stateParams, $http) {

		$scope.getSearchResults = function () {
      if ($stateParams.query !== '')
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

'use strict';

angular.module('discover').controller('TopicsController', ['$scope',
	function($scope) {
		$scope.topics = [ "software", "security", "get", "code", "process", "web", "development", "learn", "data", "business", "javascript", "cloud", "microsoft", "management", "programming", "apple", "open source", "google", "windows", "technology", "tools", "information", "design", "software process", "agile", "mobile", "developer", "app", "analytics", "service", "conference", "projects", "aws", "github", "testing", "c", "ruby", "php",  "community", "functional programming", "java", "platform", "features", "performance", "marketing", "server", "enterprise", "python", "user", "devops"];
	}
]);

'use strict';

angular.module('discover').filter('displayType', function(){
  return function(typeStr){
    if (typeStr === "podcast-audio" || typeStr === "podcast-video" || typeStr === "resource")
      return "podcast";
    else if (typeStr === "entry")
      return "episode";
    else
      return typeStr;
  };
});

'use strict';

angular.module('discover').filter('relativeDate', function(){
  return function(dateStr){
    var date = new Date(dateStr),
    //var date = new Date((dateStr || "").replace(/-/g, "/").replace(/[TZ]/g, " ")),
        diff = (((new Date()).getTime() - date.getTime()) / 1000),
        day_diff = Math.floor(diff / 86400);
    var year = date.getFullYear(),
        month = date.getMonth()+1,
        day = date.getDate();

    if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31)
        return (
            year.toString()+'-'+
              ((month<10) ? '0'+month.toString() : month.toString())+'-'+
              ((day<10) ? '0'+day.toString() : day.toString())
        );

    var r =
    (
        (
            day_diff === 0 &&
            (
                (diff < 60 && "just now") ||
                  (diff < 120 && "1 minute ago") ||
                  (diff < 3600 && Math.floor(diff / 60) + " minutes ago") ||
                  (diff < 7200 && "1 hour ago") ||
                  (diff < 86400 && Math.floor(diff / 3600) + " hours ago")
            )
        ) ||
          (day_diff === 1 && "Yesterday") ||
          (day_diff < 7 && day_diff + " days ago") ||
          (day_diff < 31 && Math.ceil(day_diff / 7) + " weeks ago")
    );
    return r;

  };
});

'use strict';

angular.module('discover').factory('Resources', ['$resource', function($resource) {
  return $resource('/resources/:id', { id: '@_id' }, {
    update: {
      method: 'PUT'
    }
  });
}]);

'use strict';

angular.module('discover').filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);