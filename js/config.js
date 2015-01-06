/*globals PB, angular */

angular.module('push.controllers', []);
angular.module('push.services', []);

PB.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    //
    // Each state's controller can be found in controllers.js
    // alternatively, register the interceptor via an anonymous factory
    $httpProvider.interceptors.push(function($q, $rootScope) {
      return {
        'responseError': function(rejection) {
           if(rejection.status === 403) {
             console.log('Unauthorized');
             $rootScope.$broadcast('event:auth-loginRequired', rejection);
           }
           return $q.reject(rejection);
        }
      };
    });

    $stateProvider
      .state('workout', {
        url: '/workout',
        templateUrl: "templates/workout.html",
      })
      .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
      })
      .state('tab.dash', {
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'DashCtrl'
          }
        }
      })
      .state('tab.friends', {
        url: '/friends',
        views: {
          'tab-friends': {
            templateUrl: 'templates/tab-friends.html',
            controller: 'FriendsCtrl'
          }
        }
      })
      .state('tab.account', {
        url: '/account',
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-account.html',
            controller: 'AccountCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise('/tab/dash');
  });
