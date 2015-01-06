angular.module('push.controllers')
  .controller('FriendsCtrl', function($scope, $ionicModal, Friends, FriendRequests) {
    $scope.friends = [];
    $scope.friend_requests = [];

    Friends.all().then(function (friends) {
      $scope.friends = friends;
    }, function () {
       console.log('something went wrong when getting friends');
    });

    FriendRequests.all().then(function (friend_requests) {
      $scope.friend_requests = friend_requests;
    }, function () {
      console.log('something went wrong when showing friend requests');
    });

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
  });
