angular.module('push.controllers')
  .controller('WorkoutCtrl', function($scope, $state, Workouts) {
    Workouts.create().then(function (workout) {
      console.log('workout created');
      console.log(workout);
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
  });

