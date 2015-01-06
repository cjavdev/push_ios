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
        console.log('RESPONSE ERROR', rejection);
        if (rejection.status === 403) {
          $rootScope.$broadcast('event:auth-loginRequired', rejection);
        }
        return $q.reject(rejection);
      }};
  });
  $stateProvider.state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  }).state('tab.workouts', {
    url: '/workouts',
    views: {'tab-workouts': {
        templateUrl: 'templates/tab-workouts.html',
        controller: 'WorkoutsCtrl'
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
  $urlRouterProvider.otherwise('/tab/workouts');
});

"use strict";
angular.module('push.services').factory('Model', function($http, $q, loc) {
  return function(options) {
    var url = loc.apiBase + options.path;
    var Model = function Model(attrs) {
      attrs = attrs || {};
      this.attributes = {};
      this.set(attrs);
    };
    ($traceurRuntime.createClass)(Model, {
      set: function(attrs) {
        for (var attr in attrs) {
          this.attributes[attr] = attrs[attr];
        }
        return this;
      },
      get: function(key) {
        return this.attributes[key];
      },
      parse: function(response) {
        return response;
      },
      save: function() {
        if (this.id) {
          return this.update();
        } else {
          return this.create();
        }
      },
      update: function() {
        var $__0 = this;
        var dfd = $q.defer();
        $http.put(this.url(), this.attributes).then((function(response) {
          $__0.set($__0.parse(response.data));
          dfd.resolve($__0);
        }), (function(response) {
          dfd.reject($__0);
        }));
        return dfd.promise;
      },
      create: function() {
        var $__0 = this;
        var dfd = $q.defer();
        $http.post(this.url(), this.attributes).then((function(response) {
          $__0.set($__0.parse(response.data));
          dfd.resolve($__0);
        }), (function(response) {
          dfd.reject($__0);
        }));
        return dfd.promise;
      },
      url: function() {
        if (this.id) {
          return url + this.id;
        } else {
          return url;
        }
      }
    }, {});
    Model.url = (function() {
      return url;
    });
    Model.all = function() {
      return $http.get(url).then((function(response) {
        return _.map(response.data, (function(data) {
          return new Model(data);
        }));
      }));
    };
    Model.create = function(attributes) {
      var model = new Model(attributes);
      return model.save();
    };
    return Model;
  };
});

"use strict";
angular.module('push.services').factory('User', function($q, $http, $window, $rootScope, loc) {
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
angular.module('push.controllers').controller('LoginCtrl', function($scope, $state, User) {
  $scope.message = '';
  $scope.login = function() {
    User.login();
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
angular.module('push.controllers').controller('AccountCtrl', function($scope, User) {
  $scope.logout = function() {
    User.logout();
  };
  $scope.settings = {enableFriends: true};
});

"use strict";
angular.module('push.services').factory('Friend', function($http, Model, loc) {
  var Friend = Model({path: '/friendships'});
  Friend.inviteFriend = function(email) {
    return $http.post(loc.apiBase + '/friend_requests', {email: email});
  };
  return Friend;
});

"use strict";
angular.module('push.services').factory('FriendRequest', function($q, $http, $rootScope, Users, loc) {
  return {all: function() {
      return $http.get(loc.apiBase + '/friend_requests');
    }};
});

"use strict";
angular.module('push.controllers').controller('FriendsCtrl', function($scope, $ionicModal, Friend, FriendRequest) {
  $scope.friends = [];
  Friend.all().then(function(friends) {
    $scope.friends = friends;
  }, function() {
    console.log('something went wrong when getting friends');
  });
});

"use strict";
angular.module('push.controllers').controller('FriendshipsCtrl', function($scope, Friend) {
  $scope.friendEmail = '';
  $scope.inviteFriend = function(email) {
    console.log('inviting', email);
    Friend.inviteFriend(email).then(function(friends) {
      $scope.friendEmail = '';
      $scope.message = 'Sent!';
    });
  };
});

"use strict";
angular.module('push.services').factory('Workout', function($http, $q, Model, loc) {
  var Workout = Model({path: '/workouts'});
  Workout.prototype.parse = function(response) {
    if (response.workout_sets) {
      this.workout_sets = _.map(response.workout_sets, (function(s) {
        return new WorkoutSet(s);
      }));
      delete response.workout_sets;
    }
    return response;
  };
  Workout.prototype.addSet = function(set) {
    var dfd = $q.defer();
    $http.post(this.url() + '/workout_sets', {reps: set.reps}).then(function(response) {
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
    this.get('workout_sets').forEach(function(set) {
      reps += set.reps;
    });
    return reps;
  };
  Workout.prototype.completedAt = function() {
    if (!this.get('completed_date')) {
      return 'Incomplete';
    }
    return this.get('completed_date');
  };
  Workout.create = function() {
    var dfd = $q.defer();
    $http.post(Workout.url(), {}).then(function(response) {
      dfd.resolve(new Workout(response.data));
    }, function(response) {
      dfd.reject(response);
    });
    return dfd.promise;
  };
  return Workout;
});

"use strict";
angular.module('push.services').factory('WorkoutSet', function(Model, Workout, loc) {
  var WorkoutSet = Model({path: '/workout_sets'});
  WorkoutSet.prototype.url = function() {
    if (!this.id) {
      return Workout.url() + this.workout_id + '/workout_sets';
    }
    return loc.apiBase + '/workout_sets' + this.id;
  };
  return WorkoutSet;
});

"use strict";
angular.module('push.controllers').controller('WorkoutCtrl', function($scope, $state, Workout, WorkoutSet) {
  $scope.workout = null;
  $scope.sets = [];
  $scope.reps = 0;
  Workout.create().then(function(workout) {
    console.log('workout created');
    console.log(workout);
    $scope.workout = workout;
  }, function() {
    console.log('uhoh workout not created', arguments);
  });
  $scope.push = function() {
    $scope.reps++;
  };
  $scope.completeSet = function() {
    var set = new WorkoutSet({
      reps: $scope.reps,
      workout_id: $scope.workout.get('id')
    });
    set.save().then((function(response) {
      $scope.sets.push(set);
      $scope.workout.workout_sets.push(set);
      $sope.reps = 0;
    }));
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

"use strict";
angular.module('push.controllers').controller('WorkoutsCtrl', function($scope, $state, $ionicModal, Workout) {
  $scope.workouts = [];
  function setupWorkouts() {
    Workout.all().then(function(workouts) {
      console.log('got all workouts');
      console.log(workouts);
      $scope.workouts = workouts;
    });
  }
  setupWorkouts();
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

//# sourceMappingURL=all.js.map