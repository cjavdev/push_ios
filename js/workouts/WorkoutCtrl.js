/*global angular */
angular.module('push.controllers')
  .controller('WorkoutCtrl', function($scope, $state, Workout, WorkoutSet) {
    $scope.workout = null;
    $scope.sets = [];
    $scope.reps = 0;

    // consider using this as a show page and only create
    // a workout if it's visiting for a start workout
    Workout
      .create()
      .then(function (workout) {
        console.log('workout created');
        console.log(workout);
        $scope.workout = workout;
      }, function () {
        console.log('uhoh workout not created', arguments);
      });

    $scope.push = function () {
      $scope.reps++;
    };

    $scope.completeSet = function () {
      var set = new WorkoutSet({
        reps: $scope.reps,
        workout_id: $scope.workout.get('id')
      });

      set.save().then((response) => {
        $scope.sets.push(set);
        $scope.workout.workout_sets.push(set);
        $sope.reps = 0;
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
  });

