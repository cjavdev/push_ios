/*global angular, _ */

angular.module('push.filters')
  .filter('reverse', function () {
    return function (items) {
      return items.slice().reverse();
    };
  })
  .filter('challengable2', function (Friendship) {
    var friendsIds = Friendship.allFbids();
    return function (items) {
      function alreadyFriends(id) {
        return _.contains(friendsIds, id);
      }

      return _.filter(items, function (item) {
        return !alreadyFriends(item.get('fbid'));
      });
    };
  })
  .filter('orderByFriendReps', function () {
    return function(friendships) {
      return _.sortBy(friendships, function (f) {
        return f.friend.totalReps();
      });
    };
  });
