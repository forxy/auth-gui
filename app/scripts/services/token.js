'use strict';

angular.module('services.token', ['restangular'])

  .factory('Token', ['Restangular', function (Restangular) {
    return {
      all: function () {
        return Restangular.all('tokens').getList();
      },
      page: function (query) {
        return Restangular.one('tokens').get(query);
      },
      get: function (token_key) {
        return Restangular.one('tokens', token_key).get();
      },
      add: function (token) {
        return Restangular.all('tokens').post(token);
      },
      save: function (token) {
        return Restangular.one('tokens', token.token_key).put(token);
      }
    }
  }]);
