/*global _, openFB, angular */
angular.module('push.services')
  .factory('Workouts', function ($http, $q, $rootScope, $state, loc) {
    function url(id) {
      if (id) {
        return loc.apiBase + '/workouts/' + id;
      }
      return loc.apiBase + '/workouts';
    }

    function Workout(attrs) {
      this.id = attrs.id;
      this.completed_date = attrs.completed_date;
      this.workout_sets = attrs.workout_sets;
    }

    Workout.prototype.addSet = function (set) {
      var dfd = $q.defer();
      $http.post(url(this.id) + '/workout_sets', {
        reps: set.reps
      }).
      then(function (response) {
        dfd.resolve(response.data);
      }, function (response) {
        dfd.reject(response);
      });
      return dfd.promise;
    };

    Workout.prototype.complete = function () {
      var dfd = $q.defer();
      $http.put(url(this.id), {}).
        then(function (response) {
          dfd.resolve(response.data);
        }, function (response) {
          dfd.reject(response);
        });
      return dfd.promise;
    };

    Workout.prototype.totalReps = function () {
      var reps = 0;
      this.workout_sets.forEach(function (set) {
        reps += set.reps;
      });
      return reps;
    };

    Workout.prototype.completedAt = function () {
      if (!this.completed_date) {
        return 'Incomplete';
      }
      return this.completed_date;
    };

    return {
      all: function () {
        var dfd = $q.defer();
        $http.get(url()).
          then(function (resp) {
            var workouts = _.map(resp.data, function (w) {
              return new Workout(w);
            });
            dfd.resolve(workouts);
          }, function (resp) {
            dfd.reject(resp.data);
          });
        return dfd.promise;
      },
      get: function (id) {
        var dfd = $q.defer();
        $http.get(url(id)).
          then(function (resp) {
            dfd.resolve(resp.data);
          }, function (resp) {
            dfd.reject(resp.data);
          });
        return dfd.promise;
      },
      create: function () {
        var dfd = $q.defer();
        $http.post(url(), {}).
          then(function (response) {
            dfd.resolve(new Workout(response.data));
          }, function(response) {
            dfd.reject(response);
          });
        return dfd.promise;
      },
    };
  });
