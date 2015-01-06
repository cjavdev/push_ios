angular.module('push.controllers')
  .controller('LoginCtrl', function($scope, $state, Users) {
    $scope.message = '';
    $scope.login = function () {
      Users.login();
    };

    $scope.$on('event:auth-loginRequired', function(e, rejection) {
      $scope.loginModal.show();
    });

    $scope.$on('event:auth-loginConfirmed', function() {
      console.log('login confirmed');
      $scope.loginModal.hide();
    });

    $scope.$on('event:auth-loginFailed', function (e, status) {
      console.log('login failed');
      $scope.message = "Login Failed";
    });

    $scope.$on('event:auth-logoutComplete', function() {
      console.log('login complete');
      $state.go('tab.dash', {}, { reload: true, inherit: false });
    });
  });
