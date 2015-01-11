/*global _, openFB, angular */
angular.module('push.services')
  .factory('Invitation', function (Model) {
    var Invitation = Model({ path: '/friend_invitations' });
    return Invitation;
  });

