/*global angular, navigator */

angular.module('push.services')
  .service('Contacts', function($q) {
    var formatContact = function(contact) {
      var primaryPhoneNumber = '';
      if(contact.phoneNumbers[0]) {
        primaryPhoneNumber = contact.phoneNumbers[0].value;
      }

      return {
        "displayName"   : contact.name.formatted || contact.name.givenName + " " + contact.name.familyName || "Mystery Person",
        "emails"        : contact.emails || [],
        "phones"        : contact.phoneNumbers || [],
        "primaryPhoneNumber"        : primaryPhoneNumber,
        "photos"        : contact.photos || []
      };
    };

    function pickContact () {
      var dfd = $q.defer();
      if(navigator && navigator.contacts) {
        navigator.contacts.pickContact(function(contact){
          dfd.resolve( formatContact(contact) );
        });
      } else {
        dfd.reject("Bummer. No contacts in desktop browser");
      }
      return dfd.promise;
    }

    return {
      pickContact : pickContact
    };
  });
