'use strict';

angular.module('discover').controller('TopicsController', ['$scope',
	function($scope) {
		$scope.topics = [ "software", "security", "code", "process", "cloud", "web", "development", "learn", "data", "business", "javascript", "microsoft", "management", "programming", "apple", "open source", "google", "windows", "technology", "tools", "information", "design", "software process", "agile", "mobile", "developer", "app", "analytics", "service", "conference", "projects", "aws", "github", "testing", "c", "ruby", "php",  "community", "functional programming", "java", "platform", "features", "performance", "marketing", "server", "enterprise", "python", "user", "devops", "drupal", "big data", "azure"];
	}
]);
