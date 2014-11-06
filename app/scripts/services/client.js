'use strict';

angular.module('services.client', ['restangular'])

  .factory('Client', ['Restangular', function (Restangular) {
    return {
      all: function () {
        return Restangular.all('clients').getList();
      },
      page: function (query) {
        return Restangular.one('clients').get(query);
      },
      get: function (client_id) {
        return Restangular.one('clients', client_id).get();
      },
      add: function (client) {
        return Restangular.all('clients').post(client);
      },
      save: function (client) {
        return Restangular.one('clients', client.client_id).put(client);
      },
      delete: function (client) {
        return Restangular.one('clients', client.client_id).remove();
      }
    }
  }]);
