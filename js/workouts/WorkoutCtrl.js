/*global angular */
angular.module('push.controllers')
  .controller('WorkoutCtrl', function($scope, $state, $rootScope, $stateParams, EventBus, Workout, WorkoutSet) {
    $scope.sets = [];
    $scope.reps = 0;
    $scope.workout = null;

    function getWorkout(id) {
      console.log('Getting Workout');
      Workout.get(id);
    }

    function createWorkout() {
      console.log('Creating Workout');
      Workout
        .create()
        .then(function (workout) {
          $scope.workout = workout;
          console.log('workout created', workout);
        }, function () {
          console.log('uhoh workout not created', arguments);
        });
    }

    function setupWorkout() {
      if($stateParams.id === "new") {
        createWorkout();
      } else {
        getWorkout($stateParams.id);
      }
    }

    setupWorkout();
    EventBus.on('authChange', setupWorkout);

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
        $scope.reps = 0;
      });
    };

    $scope.completeWorkout = function () {
      if($scope.reps > 0) {
        var set = new Set($scope.reps);
        $scope.workout.addSet(set).then(() => {
          $scope.sets.push($scope.reps);
          $scope.reps = 0;
        });
      }
      $scope.workout.save().then(() => {
        $scope.sets = [];
        $scope.reps = 0;
        $state.go('tab.workouts', {}, { reload: true, inherit: false });
      });
    };
  });
