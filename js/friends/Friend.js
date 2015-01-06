/*global _, openFB, angular */
angular.module('push.services')
  .factory('Friend', function ($http, Model, loc) {
    var Friend = Model({ path: '/friendships' });

    Friend.inviteFriend = function (email) {
      return $http.post(loc.apiBase + '/friend_requests', {
        email: email
      });
    };

    return Friend;
  });
