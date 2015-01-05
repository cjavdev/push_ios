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
.controller('WorkoutCtrl', function($scope, $state, Workouts) {
  Workouts.create().then(function (workout) {
    console.log('workout created');
    $scope.workout = workout;
  }, function () {
    console.log('uh on workout not created');
  });

  $scope.sets = [];
  $scope.reps = 0;

  $scope.push = function () {
    $scope.reps++;
  };

  function Set(reps) {
    this.reps = reps;
  }

  $scope.completeSet = function () {
    var set = new Set($scope.reps);
    $scope.workout.addSet(set).then(function () {
      $scope.sets.push(set);
      $scope.reps = 0;
    });
  };

  $scope.completeWorkout = function () {
    if($scope.reps > 0) {
      var set = new Set($scope.reps);
      $scope.workout.addSet(set).then(function () {
        $scope.sets.push($scope.reps);
        $scope.reps = 0;
      });
    }
    $scope.workout.complete().then(function () {
      $scope.sets = [];
      $scope.reps = 0;
      $state.go('tab.dash', {}, { reload: true, inherit: false });
    });
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
