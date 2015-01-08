/*global angular,openFB */
angular.module('push.services')
  .factory('User', function ($q, $http, $window, EventBus, loc) {

    function updateHeaders(params) {
      $window.localStorage.authToken = params.session_token;
      $http.defaults.headers.common['AuthToken-X'] = params.session_token;
    }

    function saveUser(params) {
      $window.localStorage.currentUser = JSON.stringify(params);
    }

    function currentUser() {
      return JSON.parse($window.localStorage.currentUser);
    }

    function pushbitLogin(loginParams) {
      var dfd = $q.defer();
      $http.post(loc.apiBase + '/session', loginParams).
        then(function (response) {
          updateHeaders(response.data);
          saveUser(response.data);
          dfd.resolve(response.data);
          EventBus.trigger('loginCompleted');
          EventBus.trigger('authChange');
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

    function fbLogout() {
      var dfd = $q.defer();
      // openFB.logout(function () {
      EventBus.trigger('loginRequired');
      EventBus.trigger('authChange');
      dfd.resolve();
      // });
      return dfd.promise;
    }

    return {
      login: function () {
        return fbLogin();
      },
      logout: function () {
        $window.localStorage.removeItem('authToken');
        return fbLogout();
      },
      currentUser: currentUser
    };
  });

