/*global angular */

angular.module('push.filters')
  .filter('reverse', function () {
    return function (items) {
      return items.slice().reverse();
    };
  });
