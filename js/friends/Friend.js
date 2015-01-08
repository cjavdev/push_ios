/*global _, openFB, angular */
angular.module('push.services')
  .factory('Friend', function (Model) {
    var Friend = Model({ path: '/friends' });

    Friend.prototype.name = function() {
      return this.get('f_name') + ' ' + this.get('l_name');
    };

    Friend.prototype.face = function() {
      return "https://graph.facebook.com/" + this.get('fbid') + "/picture?type=square";
    };

    Friend.prototype.sevenDayCount = function() {
      return this.get('seven_day_count');
    };

    return Friend;
  })
  .factory('Friendship', function ($http, Model, Friend, loc) {
    var Friendship = Model({ path: '/friendships' });

    Friendship.prototype.parse = function (attrs) {
      if(attrs.friend) {
        this.friend = new Friend(attrs.friend);
        delete attrs.friend;
      }
      return attrs;
    };

    Friendship.prototype.name = function() {
      return this.friend.name();
    };

    // This needs to be rewritten into an invitation
    // Friendship.inviteFriend = function (email) {
    //   return $http.post(loc.apiBase + '/friend_requests', {
    //     email: email
    //   });
    // };

    Friendship.allFbids = function () {
      return _.map(Friendship.all(), (r) => {
        return r.get('fbid');
      });
    };

    return Friendship;
  });
