/*global angular,openFB */
angular.module('push.services')
  .factory('User', function ($q, $http, $window, $rootScope, loc) {
    function fbLogin() {
      var dfd = $q.defer();
      openFB.login(function (response) {
        if (response.status === "connected") {
          getFBAuthParams(response.authResponse).
            then(function (user) {
              dfd.resolve(user);
            });
        } else {
          dfd.reject(response.status);
        }
      }, {
        scope: 'email,user_friends,public_profile'
      });
      return dfd.promise;
    }

    function getFBAuthParams(authResponse) {
      var dfd = $q.defer();
      openFB.api({
        path: '/v1.0/me',
        success: function (response) {
          response.authResponse = authResponse;
          pushbitLogin(response).
            then(function (user) {
              dfd.resolve(user);
            });
        },
        error: function () {
          dfd.reject();
        }
      });
      return dfd.promise;
    }

    function saveUser(params) {
      $window.localStorage['currentUser'] = JSON.stringify(params);
    }

    function currentUser() {
      return JSON.parse($window.localStorage['currentUser']);
    }

    function pushbitLogin(loginParams) {
      var deferred = $q.defer();
      $http.post(loc.apiBase + '/session', loginParams).
        then(function (response) {
          updateHeaders(response.data);
          saveUser(response.data);
          deferred.resolve(response.data);
          $rootScope.$broadcast('event:auth-loginConfirmed');
        });
      return deferred.promise;
    }

    function updateHeaders(params) {
      $http.defaults.headers.common['AuthToken-X'] = params.session_token;
    }

    function fbLogout() {
      var dfd = $q.defer();
      openFB.logout(function () {
        $rootScope.$broadcast('event:auth-loginRequired');
        dfd.resolve();
      });
      return dfd.promise;
    }

    return {
      login: function () {
        return fbLogin();
      },
      logout: function () {
        return fbLogout();
      },
      currentUser: currentUser
    };
  });

