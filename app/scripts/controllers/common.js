'use strict';

angular.module('controllers.common', ['ngAnimate'])

  .controller('MainCtrl', ['$scope', '$rootScope',
    function ($scope, $rootScope) {
      $scope.now = new Date();
      $rootScope.app = {
        settings: {
          asideFolded: false
        }
      };
    }]);
