/*global angular */

angular.module('push.controllers')
  .controller('AccountCtrl', function($scope, User) {
    $scope.logout = () => { User.logout(); };
  });
