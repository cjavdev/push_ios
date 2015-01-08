/*global angular */

angular.module('push.filters')
  .filter('reverse', function () {
    return function (items) {
      return items.slice().reverse();
    };
  })
  .filter('challengable2', function (Friendship) {
    var friendsIds = Friendship.allFbids();

    function alreadyFriends(id) {
      return _.contains(friendsIds, id);
    }

    return function (items) {
      return _.filter(items, function (item) {
        console.log('filtering');
        return !alreadyFriends(item.id);
      });
    };
  });
