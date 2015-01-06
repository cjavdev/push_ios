/*global _, openFB, angular */
angular.module('push.services')
  .factory('FriendRequest', function ($q, $http, $rootScope, Users, loc) {
    return {
      all: function () {
        return $http.get(loc.apiBase + '/friend_requests');
      }
    };
  });

