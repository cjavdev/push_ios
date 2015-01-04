/*global _, openFB, angular */
angular.module('push.services', [])
  .factory('AuthenticationService', function ($q, $http, $window, $rootScope, loc) {
    function fbLogin () {
      var deferred = $q.defer();
      openFB.login(function (response) {
        console.dir(response);
        if(response.status === "connected") {
          getFBAuthParams(response.authResponse).then(function (user) {
            deferred.resolve(user);
          });
        } else {
          deferred.reject(response.status);
        }
      }, {
        scope: 'email'
      });
      return deferred.promise;
    }

    function getFBAuthParams (authResponse) {
      var deferred = $q.defer();
      openFB.api({
        path: '/v1.0/me',
        success: function (response) {
          response.authResponse = authResponse;
          pushbitLogin(response).then(function (user) {
            deferred.resolve(user);
          });
        }
      });
      return deferred.promise;
    }

    function pushbitLogin (loginParams) {
      var deferred = $q.defer();
      $http.post(loc.apiBase + '/session', loginParams).then(function (response) {
        console.dir(response);
        $window.localStorage['currentUser'] = JSON.stringify(response.data);
        deferred.resolve(response.data);
        $rootScope.$broadcast('event:auth-loginConfirmed');
      });
      return deferred.promise;
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
      }
    };
  })
  .factory('Workouts', function ($http, $q, $rootScope, loc) {
    function url(id) {
      if (id) {
        return loc.apiBase + '/workouts/' + id + '.json';
      }
      return loc.apiBase + '/workouts.json';
    }

    function Workout (attrs) {
      this.id = attrs.id;
      this.completed_date = attrs.completed_date;
      this.workout_sets = attrs.workout_sets;
    }

    Workout.prototype.totalReps = function () {
      var reps = 0;
      this.workout_sets.forEach(function(set) {
        reps += set.reps;
      });
      return reps;
    };

    Workout.prototype.completedAt = function () {
      if(!this.completed_date) {
        return 'Incomplete';
      }
      return this.completed_date;
    };

    return {
      all: function () {
        var dfd = $q.defer();
        $http.get(url()).then(function (resp) {
          var workouts = _.map(resp.data, function (w) {
            return new Workout(w);
          });
          dfd.resolve(workouts);
        }, function (resp, status) {
          $rootScope.$broadcast('event:auth-loginRequired', status);
          dfd.reject(resp.data);
        });
        return dfd.promise;
      },
      get: function (id) {
        var dfd = $q.defer();
        $http.get(url(id)).then(function (resp) {
          dfd.resolve(resp.data);
        }, function (resp) {
          dfd.reject(resp.data);
        });
        return dfd.promise;
      }
    };
  })
  .factory('Friends', function () {
    var friends = [{
      id: 0,
      name: 'Ben Sparrow',
      notes: 'Enjoys drawing things',
      face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
    }, {
      id: 1,
      name: 'Max Lynx',
      notes: 'Odd obsession with everything',
      face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
    }, {
      id: 2,
      name: 'Andrew Jostlen',
      notes: 'Wears a sweet leather Jacket. I\'m a bit jealous',
      face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
    }, {
      id: 3,
      name: 'Adam Bradleyson',
      notes: 'I think he needs to buy a boat',
      face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
    }, {
      id: 4,
      name: 'Perry Governor',
      notes: 'Just the nicest guy',
      face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
    }];
    return {
      all: function () {
        return friends;
      },
      get: function (friendId) {
        // Simple index lookup
        return friends[friendId];
      }
    }
  });
