'use strict';

angular.module('services.group', ['restangular'])

  .factory('Group', ['Restangular', function (Restangular) {
    return {
      all: function () {
        return Restangular.all('groups').getList();
      },
      page: function (query) {
        return Restangular.one('groups').get(query);
      },
      get: function (code) {
        return Restangular.one('groups', code).get();
      },
      add: function (group) {
        return Restangular.all('groups').post(group);
      },
      save: function (group) {
        return Restangular.one('groups', group.code).put(group);
      },
      delete: function (group) {
        return Restangular.one('groups', group.code).remove();
      }
    }
  }]);
