'use strict';

angular.module('controllers.common', ['ngAnimate'])
  .controller('MainCtrl', ['$scope', '$rootScope', '$state',
    function ($scope, $rootScope, $state) {
      $scope.now = new Date();
      $rootScope.app = {
        settings: {
          asideFolded: false
        }
      };

      $scope.tabs = [
        {heading: 'Users', route: 'users.list', active: false},
        {heading: 'Applications', route: 'clients.list', active: false},
        {heading: 'Tokens', route: 'tokens.list', active: false}
      ];

      $scope.go = function (route) {
        $state.go(route);
      };

      $scope.active = function (route) {
        return $state.is(route);
      };

      $scope.$on('$stateChangeSuccess', function () {
        $scope.tabs.forEach(function (tab) {
          tab.active = $scope.active(tab.route);
        });
      });
    }])

  .controller('AlertCtrl', ['$scope', 'AlertMgr',
    function ($scope, AlertMgr) {
      $scope.alerts = AlertMgr.alerts;
      $scope.closeAlert = function (type) {
        delete $scope.alerts[type];
      };
    }]);
