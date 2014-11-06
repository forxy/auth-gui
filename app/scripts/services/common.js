'use strict';

angular.module('services.common', ['restangular'])
  .factory('AlertMgr', function () {
    return {
      alerts: {},
      addAlert: function (type, message) {
        this.alerts[type] = this.alerts[type] || [];
        this.alerts[type].push(message);
      },
      clearAlerts: function () {
        for (var i in this.alerts) {
          delete this.alerts[i];
        }
      }
    };
  });
