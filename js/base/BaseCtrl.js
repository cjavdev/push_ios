/*global angular */
angular.module('push.controllers')
  .controller('BaseCtrl', function ($scope, $ionicModal) {
    $ionicModal.fromTemplateUrl('templates/login.html', function (modal) {
      $scope.loginModal = modal;
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });

    $scope.$on('$destroy', function () {
      $scope.loginModal.remove();
    });
  });
