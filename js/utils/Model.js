/*global _, angular */
angular.module('push.services')
  .factory('Model', function ($http, $q, loc) {
    return function (options) {
      var url = loc.apiBase + options.path;

      class Model {
        constructor(attrs) {
          attrs = attrs || {};
          this.attributes = {};
          this.set(attrs);
          this.initialize.apply(this, arguments);
        }

        initialize() {
        }

        set(attrs) {
          for(var attr in attrs) {
            this.attributes[attr] = attrs[attr];
          }
          return this;
        }

        get(key) {
          return this.attributes[key];
        }

        parse(response) {
          return response;
        }

        save() {
          if(this.id) {
            return this.update();
          } else {
            return this.create();
          }
        }

        update() {
          var dfd = $q.defer();
          $http
            .put(this.url(), this.attributes)
            .then((response) => {
              this.set(this.parse(response.data));
              dfd.resolve(this);
            }, (response) => {
              dfd.reject(this);
            });
          return dfd.promise;
        }

        create() {
          var dfd = $q.defer();
          $http
            .post(this.url(), this.attributes)
            .then((response) => {
              this.set(this.parse(response.data));
              dfd.resolve(this);
            }, (response) => {
              dfd.reject(this);
            });
          return dfd.promise;
        }

        url() {
          if(this.id) {
            return url + this.id;
          } else {
            return url;
          }
        }
      }

      Model.url = () => { return url; };

      Model.all = function () {
        return $http.get(url).then((response) => {
          return _.map(response.data, (data) => {
            return new Model(data);
          });
        });
      };

      Model.create = function (attributes) {
        var model = new Model(attributes);
        return model.save();
      };
      return Model;
    };
  });
