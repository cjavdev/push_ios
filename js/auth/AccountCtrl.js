/*global angular */

angular.module('push.controllers')
  .controller('AccountCtrl', function($scope, User) {
    $scope.logout = function () {
      User.logout();
    };

    $scope.settings = {
      enableFriends: true
    };
  });
