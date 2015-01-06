/*global angular, openFB, window, cordova */

var dependencies = ['ionic', 'push.controllers', 'push.services'];

window.PB = angular.module('push', dependencies)
  .run(function ($ionicPlatform) {
    openFB.init({ appId: '1389364367952791' });

    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the
      // accessory bar above the keyboard for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }

      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })
  .constant('loc', {
    // apiBase: 'http://localhost:3000'
    apiBase: 'http://www.pushbit.io'
  });

