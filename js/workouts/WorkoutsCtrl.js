/*global angular */

angular.module('push.controllers')
  .controller('WorkoutsCtrl', function($scope, $state, $ionicModal, Workout) {
    $scope.workouts = [];

    function setupWorkouts () {
      Workout.all().then(function (workouts) {
        console.log('got all workouts');
        console.log(workouts);
        $scope.workouts = workouts;
      });
    }

    setupWorkouts();

    $scope.$on('event:auth-loginConfirmed', function() {
      setupWorkouts();
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
  });
