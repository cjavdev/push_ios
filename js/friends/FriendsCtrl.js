/*global angular */
angular.module('push.controllers')
  .controller('FriendsCtrl', function($scope, $ionicModal, Friend, FriendRequest) {
    $scope.friends = [];
    // $scope.friend_requests = [];

    Friend.all().then(function (friends) {
      $scope.friends = friends;
    }, function () {
       console.log('something went wrong when getting friends');
    });

    // FriendRequest.all().then(function (friend_requests) {
    //   $scope.friend_requests = friend_requests;
    // }, function () {
    //   console.log('something went wrong when showing friend requests');
    // });
    //
    // $ionicModal.fromTemplateUrl('templates/friendships.html', function (modal) {
    //   $scope.friendshipsModal = modal;
    // }, {
    //   scope: $scope,
    //   animation: 'slide-in-up'
    // });
    //
    // $scope.showFriendships = function () {
    //   $scope.friendshipsModal.show();
    // };
    //
    // $scope.done = function () {
    //   $scope.friendshipsModal.hide();
    // };
  });
