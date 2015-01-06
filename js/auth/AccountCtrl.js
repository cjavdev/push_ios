angular.module('push.controllers')
  .controller('AccountCtrl', function($scope, Users) {
    $scope.logout = function () {
      Users.logout();
    };
    $scope.settings = {
      enableFriends: true
    };
  });
