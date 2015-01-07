/*global angular */
angular.module('push.controllers')
  .controller('FriendsCtrl', function($scope, $ionicModal, Friend, FriendRequest, SentFriendRequest, Contacts) {
    $scope.friends = [];
    // $scope.friend_requests = [];

    $scope.friends = Friend.all();
    $scope.contacts = [{
      Name: 'name',
      Title: 'title',
      Id: 1
    }];

    SentFriendRequest.all();
    $scope.requests = FriendRequest.all();
    console.log($scope.requests);
    // FriendRequest.all().then(function (friend_requests) {
    //   $scope.friend_requests = friend_requests;
    // }, function () {
    //   console.log('something went wrong when showing friend requests');
    // });

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
