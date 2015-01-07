/*global angular */

angular.module('push.controllers')
  .controller('LoginCtrl', function($scope, $state, User, EventBus) {
    $scope.message = '';
    $scope.login = function () {
      User.login();
    };

    EventBus.on('loginRequired', function(e, rejection) {
      $scope.loginModal.show();
    });

    EventBus.on('loginCompleted', function() {
      $scope.loginModal.hide();
    });

    EventBus.on('loginFailed', function (e, status) {
      $scope.message = "Login Failed";
    });

    EventBus.on('logoutCompleted', function() {
      $state.go('tab.dash', {}, { reload: true, inherit: false });
    });
  });
