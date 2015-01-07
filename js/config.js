/*globals PB, angular */

angular.module('push.controllers', []);
angular.module('push.services', []);
angular.module('push.filters', []);

PB.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $windowProvider) {
  $httpProvider.interceptors.push(function ($q, EventBus) {
    return {
      'responseError': function (rejection) {
        if (rejection.status === 403) {
          EventBus.trigger('loginRequired', rejection);
        }
        return $q.reject(rejection);
      }
    };
  });

  var $window = $windowProvider.$get();
  $httpProvider.defaults.headers.common['AuthToken-X'] = $window.localStorage.authToken;

  $stateProvider
    .state('workout', {
      url: "/workout/:id",
      templateUrl: "templates/workout.html"
    })
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tab.workouts', {
      url: '/workouts',
      views: {
        'tab-workouts': {
          templateUrl: 'templates/tab-workouts.html',
          controller: 'WorkoutsCtrl'
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

  $urlRouterProvider.otherwise('/tab/workouts');
});
