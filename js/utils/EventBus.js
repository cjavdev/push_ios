/*global _, angular */
angular.module('push.services')
  .factory('EventBus', function () {
    var events = {};

    return {
      on: function(eventName, callback) {
        console.log('ListeningTo: ', eventName);
        events[eventName] = (events[eventName] || []);
        events[eventName].push(callback);
      },

      trigger: function(eventName) {
        console.log('Triggering: ', eventName);
        events[eventName] = (events[eventName] || []);

        var args = [].slice.call(arguments, 1);
        for(var callback of events[eventName]) {
          callback(args);
        }
      }
    }
  });
