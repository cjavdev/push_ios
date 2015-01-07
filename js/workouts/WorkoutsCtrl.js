/*global angular */

angular.module('push.controllers')
  .controller('WorkoutsCtrl', function($scope, $location, EventBus, Workout) {
    $scope.workouts = [];

    function setupWorkouts () {
      console.log('setting up workouts');
      $scope.workouts = Workout.all();
    }
    setupWorkouts();

    $scope.startNewWorkout = function () {
      $location.url('/workout/new');
    };

    EventBus.on('loginCompleted', setupWorkouts);
  });
