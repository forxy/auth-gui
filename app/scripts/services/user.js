'use strict';

angular.module('services.user', ['restangular'])

  .factory('User', ['Restangular', function (Restangular) {
    return {
      all: function () {
        return Restangular.all('users').getList();
      },
      page: function (query) {
        return Restangular.one('users').get(query);
      },
      get: function (email) {
        return Restangular.one('users', email).get();
      },
      add: function (user) {
        return Restangular.all('users').post(user);
      },
      save: function (user) {
        return Restangular.one('users', user.email).put(user);
      },
      delete: function (user) {
        return Restangular.one('users', user.email).remove();
      }
    }
  }]);
