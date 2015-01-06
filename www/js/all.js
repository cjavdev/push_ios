"use strict";
var dependencies = ['ionic', 'push.controllers', 'push.services'];
window.PB = angular.module('push', dependencies).run(function($ionicPlatform) {
  openFB.init({appId: '1389364367952791'});
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
}).constant('loc', {apiBase: 'http://www.pushbit.io'});

"use strict";
angular.module('push.controllers', []);
angular.module('push.services', []);
PB.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $httpProvider.interceptors.push(function($q, $rootScope) {
    return {'responseError': function(rejection) {
        if (rejection.status === 403) {
          console.log('Unauthorized');
          $rootScope.$broadcast('event:auth-loginRequired', rejection);
        }
        return $q.reject(rejection);
      }};
  });
  $stateProvider.state('workout', {
    url: '/workout',
    templateUrl: "templates/workout.html"
  }).state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  }).state('tab.dash', {
    url: '/dash',
    views: {'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }}
  }).state('tab.friends', {
    url: '/friends',
    views: {'tab-friends': {
        templateUrl: 'templates/tab-friends.html',
        controller: 'FriendsCtrl'
      }}
  }).state('tab.account', {
    url: '/account',
    views: {'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }}
  });
  $urlRouterProvider.otherwise('/tab/dash');
});

"use strict";
angular.module('push.controllers').controller('DashCtrl', function($scope, $state, $ionicModal, Workouts) {
  $scope.workouts = [];
  function setupWorkouts() {
    Workouts.all().then(function(workouts) {
      console.log('got all workouts');
      console.log(workouts);
      $scope.workouts = workouts;
    });
  }
  setupWorkouts();
  console.log('setting up loginConfirmed event');
  $scope.$on('event:auth-loginConfirmed', function() {
    setupWorkouts();
  });
  $scope.startWorkout = function() {
    $state.go('workout', {}, {
      reload: true,
      inherit: false
    });
  };
  $ionicModal.fromTemplateUrl('templates/login.html', function(modal) {
    $scope.loginModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });
  $scope.$on('$destroy', function() {
    $scope.loginModal.remove();
  });
});

"use strict";
angular.module('push.services').factory('Users', function($q, $http, $window, $rootScope, loc) {
  function fbLogin() {
    var dfd = $q.defer();
    openFB.login(function(response) {
      if (response.status === "connected") {
        getFBAuthParams(response.authResponse).then(function(user) {
          dfd.resolve(user);
        });
      } else {
        dfd.reject(response.status);
      }
    }, {scope: 'email,user_friends,public_profile'});
    return dfd.promise;
  }
  function getFBAuthParams(authResponse) {
    var dfd = $q.defer();
    openFB.api({
      path: '/v1.0/me',
      success: function(response) {
        response.authResponse = authResponse;
        pushbitLogin(response).then(function(user) {
          dfd.resolve(user);
        });
      },
      error: function() {
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
    $http.post(loc.apiBase + '/session', loginParams).then(function(response) {
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
    openFB.logout(function() {
      $rootScope.$broadcast('event:auth-loginRequired');
      dfd.resolve();
    });
    return dfd.promise;
  }
  return {
    login: function() {
      return fbLogin();
    },
    logout: function() {
      return fbLogout();
    },
    currentUser: currentUser
  };
});

"use strict";
angular.module('push.controllers').controller('LoginCtrl', function($scope, $state, Users) {
  $scope.message = '';
  $scope.login = function() {
    Users.login();
  };
  $scope.$on('event:auth-loginRequired', function(e, rejection) {
    $scope.loginModal.show();
  });
  $scope.$on('event:auth-loginConfirmed', function() {
    console.log('login confirmed');
    $scope.loginModal.hide();
  });
  $scope.$on('event:auth-loginFailed', function(e, status) {
    console.log('login failed');
    $scope.message = "Login Failed";
  });
  $scope.$on('event:auth-logoutComplete', function() {
    console.log('login complete');
    $state.go('tab.dash', {}, {
      reload: true,
      inherit: false
    });
  });
});

"use strict";
angular.module('push.controllers').controller('AccountCtrl', function($scope, Users) {
  $scope.logout = function() {
    Users.logout();
  };
  $scope.settings = {enableFriends: true};
});

"use strict";
angular.module('push.services').factory('Friends', function($http, loc) {
  return {
    all: function() {
      return $http.get(loc.apiBase + '/friendships');
    },
    inviteFriend: function(email) {
      return $http.post(loc.apiBase + '/friend_requests', {email: email});
    }
  };
});

"use strict";
angular.module('push.services').factory('FriendRequests', function($q, $http, $rootScope, Users, loc) {
  return {all: function() {
      return $http.get(loc.apiBase + '/friend_requests');
    }};
});

"use strict";
angular.module('push.controllers').controller('FriendsCtrl', function($scope, $ionicModal, Friends, FriendRequests) {
  $scope.friends = [];
  $scope.friend_requests = [];
  Friends.all().then(function(friends) {
    $scope.friends = friends;
  }, function() {
    console.log('something went wrong when getting friends');
  });
  FriendRequests.all().then(function(friend_requests) {
    $scope.friend_requests = friend_requests;
  }, function() {
    console.log('something went wrong when showing friend requests');
  });
  $ionicModal.fromTemplateUrl('templates/friendships.html', function(modal) {
    $scope.friendshipsModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });
  $scope.showFriendships = function() {
    $scope.friendshipsModal.show();
  };
  $scope.done = function() {
    $scope.friendshipsModal.hide();
  };
});

"use strict";
angular.module('push.controllers').controller('FriendshipsCtrl', function($scope, Friends) {
  $scope.friendEmail = '';
  $scope.inviteFriend = function(email) {
    console.log('inviting', email);
    Friends.inviteFriend(email).then(function(friends) {
      $scope.friendEmail = '';
      $scope.message = 'Sent!';
    });
  };
});

"use strict";
angular.module('push.services').factory('Workouts', function($http, $q, $rootScope, $state, loc) {
  function url(id) {
    if (id) {
      return loc.apiBase + '/workouts/' + id;
    }
    return loc.apiBase + '/workouts';
  }
  function Workout(attrs) {
    this.id = attrs.id;
    this.completed_date = attrs.completed_date;
    this.workout_sets = attrs.workout_sets;
  }
  Workout.prototype.addSet = function(set) {
    var dfd = $q.defer();
    $http.post(url(this.id) + '/workout_sets', {reps: set.reps}).then(function(response) {
      dfd.resolve(response.data);
    }, function(response) {
      dfd.reject(response);
    });
    return dfd.promise;
  };
  Workout.prototype.complete = function() {
    var dfd = $q.defer();
    $http.put(url(this.id), {}).then(function(response) {
      dfd.resolve(response.data);
    }, function(response) {
      dfd.reject(response);
    });
    return dfd.promise;
  };
  Workout.prototype.totalReps = function() {
    var reps = 0;
    this.workout_sets.forEach(function(set) {
      reps += set.reps;
    });
    return reps;
  };
  Workout.prototype.completedAt = function() {
    if (!this.completed_date) {
      return 'Incomplete';
    }
    return this.completed_date;
  };
  return {
    all: function() {
      var dfd = $q.defer();
      $http.get(url()).then(function(resp) {
        var workouts = _.map(resp.data, function(w) {
          return new Workout(w);
        });
        dfd.resolve(workouts);
      }, function(resp) {
        dfd.reject(resp.data);
      });
      return dfd.promise;
    },
    get: function(id) {
      var dfd = $q.defer();
      $http.get(url(id)).then(function(resp) {
        dfd.resolve(resp.data);
      }, function(resp) {
        dfd.reject(resp.data);
      });
      return dfd.promise;
    },
    create: function() {
      var dfd = $q.defer();
      $http.post(url(), {}).then(function(response) {
        dfd.resolve(new Workout(response.data));
      }, function(response) {
        dfd.reject(response);
      });
      return dfd.promise;
    }
  };
});

"use strict";

"use strict";
angular.module('push.controllers').controller('WorkoutCtrl', function($scope, $state, Workouts) {
  Workouts.create().then(function(workout) {
    console.log('workout created');
    console.log(workout);
    $scope.workout = workout;
  }, function() {
    console.log('uh on workout not created');
  });
  $scope.sets = [];
  $scope.reps = 0;
  $scope.push = function() {
    $scope.reps++;
  };
  function Set(reps) {
    this.reps = reps;
  }
  $scope.completeSet = function() {
    var set = new Set($scope.reps);
    $scope.workout.addSet(set).then(function() {
      $scope.sets.push(set);
      $scope.reps = 0;
    });
  };
  $scope.completeWorkout = function() {
    if ($scope.reps > 0) {
      var set = new Set($scope.reps);
      $scope.workout.addSet(set).then(function() {
        $scope.sets.push($scope.reps);
        $scope.reps = 0;
      });
    }
    $scope.workout.complete().then(function() {
      $scope.sets = [];
      $scope.reps = 0;
      $state.go('tab.dash', {}, {
        reload: true,
        inherit: false
      });
    });
  };
});

//# sourceMappingURL=all.js.map