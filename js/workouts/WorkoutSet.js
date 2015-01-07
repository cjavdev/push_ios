/*global _, openFB, angular */
angular.module('push.services')
  .factory('WorkoutSet', function (Model, Workout, loc) {
    var WorkoutSet = Model({ path: '/workout_sets' });

    WorkoutSet.prototype.url = function () {
      if(!this.id) {
        return Workout.url() + '/' + this.get('workout_id') + '/workout_sets';
      }
      return loc.apiBase + '/workout_sets' + this.id;
    };

    return WorkoutSet;
  });
