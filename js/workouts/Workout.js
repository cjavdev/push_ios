/*global _, openFB, angular */
angular.module('push.services')
  .factory('Workout', function ($http, $q, Model, loc) {
    var Workout = Model({ path: '/workouts' });

    Workout.prototype.initialize = function () {
      this.workout_sets = [];
    };

    Workout.prototype.parse = function (response) {
      if(response.workout_sets) {
        this.workout_sets = _.map(response.workout_sets, (s) => {
          return new WorkoutSet(s);
        });
        delete response.workout_sets;
      }
      return response;
    };

    Workout.prototype.addSet = function (set) {
      var dfd = $q.defer();
      $http.post(this.url() + '/workout_sets', {
        reps: set.reps
      }).
      then(function (response) {
        dfd.resolve(response.data);
      }, function (response) {
        dfd.reject(response);
      });
      return dfd.promise;
    };

    Workout.prototype.totalReps = function () {
      var reps = 0;
      this.get('workout_sets').forEach(function (set) {
        reps += set.reps;
      });
      return reps;
    };

    Workout.prototype.completedAt = function () {
      if (!this.get('completed_date')) {
        return 'Incomplete';
      }
      return this.get('completed_date');
    };

    Workout.create = function () {
      var dfd = $q.defer();
      $http.post(Workout.url(), {}).
        then(function (response) {
          dfd.resolve(new Workout(response.data));
        }, function(response) {
          dfd.reject(response);
        });
      return dfd.promise;
    };

    return Workout;
  });
