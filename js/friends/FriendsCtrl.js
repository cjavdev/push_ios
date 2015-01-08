/*global angular */
angular.module('push.controllers')
  .controller('FriendsCtrl', function($scope, $ionicModal, Friendship, FriendRequest, SentFriendRequest) {
    $scope.friendships = Friendship.all();
    $scope.requests = FriendRequest.all();

    $scope.anyChallengers = function () {
      return $scope.requests.length > 0;
    };

    $ionicModal.fromTemplateUrl('templates/friendships.html', function (modal) {
      $scope.friendshipsModal = modal;
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });

    $scope.showFriendships = function () {
      $scope.friendshipsModal.show();
    };

    $scope.done = function () {
      $scope.friendshipsModal.hide();
    };

    $scope.accept = function (request) {
      request.accept().then(() => {
        Friend.all();
      });
    };

    SentFriendRequest.all();
  });
