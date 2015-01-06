angular.module('push.controllers')
  .controller('FriendshipsCtrl', function($scope, Friend) {
    $scope.friendEmail = '';

    $scope.inviteFriend = function(email) {
      console.log('inviting', email);
      Friend.inviteFriend(email).then(function (friends) {
        $scope.friendEmail = '';
        $scope.message = 'Sent!';
      });
    }
  });
