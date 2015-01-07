/*global _, openFB, angular */
angular.module('push.services')
  .factory('Workout', function ($http, $q, Model, WorkoutSet, loc) {
    var Workout = Model({ path: '/workouts' });

    Workout.prototype.setup = function () {
      this.workout_sets = [];
    };

    Workout.prototype.parse = function (response) {
      if(response.workout_sets) {
        console.log('response has workout_sets');
        this.workout_sets = _.map(response.workout_sets, (s) => {
          return new WorkoutSet(s);
        });
        delete response.workout_sets;
      }
      return response;
    };

    Workout.prototype.totalReps = function () {
      var reps = 0;
      for(var set of this.workout_sets) {
        reps += set.get('reps');
      }
      return reps;
    };

    Workout.prototype.completedAt = function () {
      if (!this.get('completed_date')) {
        return 'Incomplete';
      }
      return this.get('completed_date');
    };

    return Workout;
  });
