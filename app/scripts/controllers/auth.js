'use strict';

angular.module('controllers.auth', ['ngAnimate'])

  .controller('AuthCtrl', ['$scope', '$state', 'AlertMgr', '$location', 'Client', '$animate', 'Auth',
    function ($scope, $state, AlertMgr, $location, Client, $animate, Auth) {
      $scope.scope = $location.search().scope;
      $scope.response_type = $location.search().response_type;
      $scope.client_id = $location.search().client_id;
      $scope.redirect_uri = $location.search().redirect_uri;
      $scope.state = $location.search().state;
      $scope.alerts = [];

      $scope.scopes = $scope.scope.split(' ');
      var authForm = $('#auth-form');

      Client.get($scope.client_id).then(function (response) {
        if (response) {
          $scope.client = response;
        }
      }, function (error) {
        if (error) {
          $scope.alerts = [];
          $scope.alerts.push({
            msg: error.status + ' : ' + error.statusText,
            type: 'danger'
          });
          $animate.addClass(authForm, 'shake', function () {
            $animate.removeClass(authForm, 'shake');
          });
        }
      });
    }])

  .controller('LoginCtrl', ['$scope', '$state', 'AlertMgr', '$location', 'Auth', '$stateParams', '$sessionStorage', '$animate', '$modal',
    function ($scope, $state, AlertMgr, $location, Auth, $stateParams, $sessionStorage, $animate, $modal) {
      $scope.$storage = $sessionStorage;
      $scope.credentials = {};
      $scope.rememberMe = false;
      $scope.loginDialog = null;

      $scope.login = function () {
        Auth.login($scope.credentials, $scope.rememberMe, function () {
          var redirect_uri = $stateParams.continue ? $stateParams.continue : '/';
          $location.url(redirect_uri);
        }, function (resp) {
          var loginForm = $('#login-form');
          $animate.addClass(loginForm, 'shake', function () {
            $animate.removeClass(loginForm, 'shake');
          });
          throw {
            message: !!resp.data.error ? resp.data.error + ' : ' + resp.data.messages[0] : 'Error: ' + resp.status,
            namespace: 'login'
          };
        });
      };
      $scope.logout = function () {
        Auth.logout();
        $state.transitionTo('config.clients.list', $stateParams, {reload: true});
        //$state.transitionTo('login', {continue: $location.url()});
        $scope.openLoginDialog();
      };

      $scope.openLoginDialog = function () {
        $scope.loginDialog = $modal.open({
          templateUrl: '/views/login.html',
          controller: 'LoginModalCtrl',
          size: 'sm'
        });
      }
    }])

  .controller('LoginModalCtrl', ['$scope', '$state', 'AlertMgr', '$location', 'Auth', '$stateParams', '$sessionStorage', '$animate', '$modalInstance',
    function ($scope, $state, AlertMgr, $location, Auth, $stateParams, $sessionStorage, $animate, $modalInstance) {
      $scope.$storage = $sessionStorage;
      $scope.credentials = {};
      $scope.rememberMe = false;
      $scope.alerts = [];

      $scope.login = function () {
        Auth.login($scope.credentials, $scope.rememberMe, function () {
          $modalInstance.close();
          $state.reload()
        }, function (resp) {
          var loginForm = $('#login-form');
          $animate.addClass(loginForm, 'shake', function () {
            $animate.removeClass(loginForm, 'shake');
          });
          throw {
            message: !!resp.data.error ? resp.data.error + ' : ' + resp.data.messages[0] : 'Error: ' + resp.status,
            namespace: 'login'
          };
        });
      };
    }]);
