/*global _, openFB, angular */
angular.module('push.services')
  .factory('FriendRequest', function ($http, Model) {
    var FriendRequest = Model({
      path: '/friend_requests'
    });

    FriendRequest.prototype.accept = function() {
      var acceptUrl = this.url() + '/accept';
      console.log('sending accept request to: ', acceptUrl);
      return $http.post(acceptUrl);
    };

    FriendRequest.createForContact = function (contact) {
      var fbid = contact.id;
      var request = new FriendRequest({
        fbid: fbid
      });
      return request.save();
    };

    return FriendRequest;
  })
  .factory('SentFriendRequest', function (Model) {
    var SentFriendRequest = Model({
      path: '/friend_requests?type=sent'
    });

    SentFriendRequest.allFbids = function () {
      return _.map(SentFriendRequest.all(), (r) => {
        return r.get('recipient').fbid;
      });
    };

    return SentFriendRequest;
  });
