/*global angular */

angular.module('push.controllers')
  .controller('WorkoutsCtrl', function($scope, EventBus, Workout) {
    $scope.workouts = [];

    function setupWorkouts () {
      console.log('setting up workouts');
      $scope.workouts = Workout.all();
    }
    setupWorkouts();

    EventBus.on('loginCompleted', setupWorkouts);
  });
