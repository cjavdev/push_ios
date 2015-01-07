/*global _, openFB, angular */
angular.module('push.services')
  .factory('WorkoutSet', function (Model, loc) {
    var WorkoutSet = Model({ path: '/workout_sets' });

    WorkoutSet.prototype.url = function () {
      if(!this.id) {
        return loc.apiBase + '/workouts/' + this.get('workout_id') + '/workout_sets';
      }
      return loc.apiBase + '/workout_sets' + this.id;
    };

    return WorkoutSet;
  });
