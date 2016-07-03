'use strict';

// Config Google Analytics
angular.module('discover', ['angular-google-analytics']).config(['AnalyticsProvider',
	function(AnalyticsProvider) {
		AnalyticsProvider.setAccount({
		  tracker: 'UA-78350653-1',
		  name: "tracker1",
		  displayFeatures: true,
		  enhancedLinkAttribution: true,
		  trackEvent: true
		});
		// Track all URL query params (default is false).
		AnalyticsProvider.trackUrlParams(true);
		// Track all routes (default is true).
  	AnalyticsProvider.trackPages(true);
		// Change the default page event name.
	  // Helpful when using ui-router, which fires $stateChangeSuccess instead of $routeChangeSuccess.
	  AnalyticsProvider.setPageEvent('$stateChangeSuccess');
		// Ignore first page view (default is false).
		// Helpful when using hashes and whenever your bounce rate looks obscenely low.
		AnalyticsProvider.ignoreFirstPageLoad(false);
		// Set the domain name
  	AnalyticsProvider.setDomainName('www.podcastdiscovery.net');
		// Log all outbound calls to an in-memory array accessible via ```Analytics.log``` (default is false).
  	// This is useful for troubleshooting and seeing the order of calls with parameters.
		AnalyticsProvider.logAllCalls(true);
	}
]);
