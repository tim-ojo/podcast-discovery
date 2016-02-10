'use strict';

angular.module('discover').factory('Resources', ['$resource', function($resource) {
  return $resource('/resources/:id', { id: '@_id' }, {
    update: {
      method: 'PUT'
    }
  });
}]);
