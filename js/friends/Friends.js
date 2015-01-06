/*global _, openFB, angular */
angular.module('push.services')
  .factory('Friends', function ($http, loc) {
    return {
      all: function () {
        return $http.get(loc.apiBase + '/friendships');
      },
      inviteFriend: function (email) {
        return $http.post(loc.apiBase + '/friend_requests', { email: email });
      }
    };
  });
