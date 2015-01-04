angular.module('push.controllers', [])
.controller('DashCtrl', function($scope, $state, $ionicModal, Workouts) {
  $scope.workouts = [];
  Workouts.all().then(function (workouts) {
    $scope.workouts = workouts;
  });

  $scope.startWorkout = function () {
    $state.go('workout', {}, { reload: true, inherit: false });
  };

  $ionicModal.fromTemplateUrl('templates/login.html', function (modal) {
    $scope.loginModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.$on('$destroy', function () {
    $scope.loginModal.remove();
  });
})
.controller('WorkoutCtrl', function($scope) {
  console.log("workout controller initialized");
  $scope.message = "testing";
  $scope.count = 0;
  $scope.push = function () {
    $scope.count++;
  };

  $scope.completeSet = function () {
  };

  $scope.completeWorkout = function () {
  };
})
.controller('LoginCtrl', function($scope, AuthenticationService) {
  $scope.message = '';
  $scope.login = function () {
    AuthenticationService.login();
  };

  $scope.$on('event:auth-loginRequired', function(e, rejection) {
    $scope.loginModal.show();
  });

  $scope.$on('event:auth-loginConfirmed', function() {
    $scope.loginModal.hide();
  });

  $scope.$on('event:auth-loginFailed', function (e, status) {
    $scope.message = "Login Failed";
  });

  $scope.$on('event:auth-logoutComplete', function() {
    $state.go('tab.dash', {}, { reload: true, inherit: false });
  });
})
.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})
.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})
.controller('AccountCtrl', function($scope, AuthenticationService) {
  $scope.logout = function () {
    AuthenticationService.logout();
  };
  $scope.settings = {
    enableFriends: true
  };
});
