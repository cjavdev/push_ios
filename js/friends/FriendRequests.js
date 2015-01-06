/*global _, openFB, angular */
angular.module('push.services')
  .factory('FriendRequests', function ($q, $http, $rootScope, Users, loc) {
    return {
      all: function () {
        return $http.get(loc.apiBase + '/friend_requests');
      }
    };
  });

