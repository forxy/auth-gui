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

  .controller('LoginCtrl', ['$scope', '$state', 'AlertMgr', '$location', 'Auth', '$stateParams', '$sessionStorage', '$animate',
    function ($scope, $state, AlertMgr, $location, Auth, $stateParams, $sessionStorage, $animate) {
      $scope.continue = $location.search().continue;
      $scope.$storage = $sessionStorage;
      $scope.credentials = {};
      $scope.rememberMe = false;
      $scope.alerts = [];
      var loginForm = $('#login-form');

      $scope.login = function () {
        Auth.login($scope.credentials, $scope.rememberMe, function () {
          var redirect_uri = $stateParams.continue ? $stateParams.continue : '/';
          $location.url(redirect_uri);
        }, function (error) {
          $scope.alerts = [];
          error.data.messages.forEach(function (item) {
            $scope.alerts.push({
              msg: item,
              type: 'danger'
            });
          });
          $animate.addClass(loginForm, 'shake', function () {
            $animate.removeClass(loginForm, 'shake');
          });
        });
      };
      $scope.logout = function () {
        Auth.logout();
        $state.transitionTo('login', {continue: $location.url()});
      };
    }]);
