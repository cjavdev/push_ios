angular.module('push.controllers')
  .controller('FriendshipsCtrl', function($scope, Friends) {
    $scope.friendEmail = '';

    $scope.inviteFriend = function(email) {
      console.log('inviting', email);
      Friends.inviteFriend(email).then(function (friends) {
        $scope.friendEmail = '';
        $scope.message = 'Sent!';
      });
    }
  });
