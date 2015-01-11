/*global _, angular */
angular.module('push.services')
  .factory('Model', function ($http, $q, $window, loc) {
    return function (options) {
      var path = options.path;
      var url = loc.apiBase + path;

      class Model {
        constructor(attrs) {
          this.setup.apply(this, arguments);
          attrs = attrs || {};
          this.attributes = {};
          this.set(this.parse(attrs));
          this.initialize.apply(this, arguments);
        }

        get id() {
          return this.attributes.id;
        }

        initialize() {
        }

        setup() {
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
            console.log('updating!', this.attributes);
            return this.update();
          } else {
            console.log('creating!', this.attributes);
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
              console.log('Update failed');
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
              console.log('Create failed');
              dfd.reject(this);
            });
          return dfd.promise;
        }

        url() {
          if(this.id) {
            return url + '/' + this.id;
          } else {
            return url;
          }
        }
      }

      Model.url = () => { return url; };

      var _all = [];

      function readAllLocal() {
        if($window.localStorage[path]) {
          var attrs = JSON.parse($window.localStorage[path]);
          _all = _.map(attrs, (attr) => { return new Model(attr) });
        }
      }

      function writeAllLocal(attrs) {
        $window.localStorage[path] = JSON.stringify(attrs);
      }

      Model.ids = function () {
        return _.map(_all, (model) => { return model.id });
      };

      Model.all = function () {
        readAllLocal();
        var ids = Model.ids();

        $http.get(url, { cache: true }).then((response) => {
          writeAllLocal(response.data);
          _.each(response.data, (data) => {
            if(!_.any(_all, (m) => {
              return m.id === data.id;
            })) {
              _all.push(new Model(data));
            }
          });
        });

        return _all;
      };

      Model.create = function (attributes) {
        var model = new Model(attributes);
        _all.push(model);
        return model.save();
      };

      return Model;
    };
  });
