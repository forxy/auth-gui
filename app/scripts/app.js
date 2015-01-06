'use strict';

angular.module('authServiceAdmin', [
  'ngStorage',
  'ngSanitize',
  'ngAnimate',
  'restangular',
  'ui.bootstrap',
  'ui.router',
  'controllers.common',
  'controllers.auth',
  'controllers.user',
  'controllers.client',
  'controllers.group',
  'controllers.token',
  'directives.form-auto-fill-fix',
  'directives.on-blur-change',
  'directives.on-enter-blur',
  'directives.sort-by',
  'directives.error-handling',
  'services.common',
  'services.user',
  'services.client',
  'services.group',
  'services.token',
  'services.auth',
  'services.config',
  'filters'
])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', 'RestangularProvider', 'OAuthProvider', 'config',
    function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, RestangularProvider, OAuthProvider, config) {

      //$httpProvider.defaults.headers.common['Authorization'] = 'Bearer ' + 'eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE0MDkzNTUyMjAsInN1YiI6ImFkbWluQGFkbWluLmNvbSIsIm5iZiI6MTQwOTM1NDYyMCwiYXVkIjpbImh0dHA6XC9cL2xvY2FsaG9zdDoxMTA4MFwvQXV0aFNlcnZpY2VcLyJdLCJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3Q6MTEwODBcL0F1dGhTZXJ2aWNlXC8iLCJqdGkiOiI0N2U3NWFlZS0zMzk5LTQyZTQtOWEzNy1mMWQ5YTYzYWM3MDAiLCJpYXQiOjE0MDkzNTQ2MjB9.pvMmzmdcnsdaIOVf1EZLdx_rsSyQL3G0dVdRtOjZAl46xiPIoUu_MdP_O0MYkeQ0rIayLRe9qnmaNPjnuGeMXyf1HE5qfa9lkAhXljWMBBFC3sqmUvZj1S0Pd-c4dt7AiCDVPvTbK9_JMK8wKuCTNbyGSl-OScLIUl-yqfDTkis';

      RestangularProvider.setDefaultHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      });

      OAuthProvider.extendConfig({
        authenticationEndpoint: 'http://localhost:11080/auth/login/',
        authorizationEndpoint: 'http://localhost:11080/auth/authorize/',
        client_id: '53cab7ca3004c4a709c985c3',
        client_secret: 'secret',
        scope: 'readClients writeClients readTokens updateTokens'
      });

      RestangularProvider.setBaseUrl(config.apiEndpoint);

      var access = routingConfig.accessLevels;

      $urlRouterProvider.otherwise('/clients/');

      $stateProvider
        .state('login', {
          url: '/login/?continue',
          templateUrl: 'views/login.html',
          controller: 'LoginCtrl',
          data: {
            access: access.public
          }
        })
        .state('auth', {
          url: '/auth/?client_id',
          templateUrl: 'views/auth.html',
          controller: 'AuthCtrl',
          data: {
            access: access.public
          }
        })
        .state('config', {
          abstract: true,
          templateUrl: 'views/layout.html',
          controller: 'MainCtrl'
        })
        .state('config.users', {
          abstract: true,
          templateUrl: 'views/config.stump.html',
          controller: 'MainCtrl',
          data: {
            access: access.public
          }
        })
        .state('config.users.list', {
          url: '/users/',
          templateUrl: 'views/users/list.html',
          controller: 'UsersListCtrl',
          data: {
            access: access.users_reader
          }
        })
        .state('config.users.details', {
          url: '/users/:login/:mode/',
          templateUrl: 'views/users/details.html',
          controller: 'UserDetailsCtrl',
          data: {
            access: access.users_manager
          }
        })
        .state('config.clients', {
          abstract: true,
          templateUrl: 'views/config.stump.html',
          controller: 'MainCtrl',
          data: {
            access: access.public
          }
        })
        .state('config.clients.list', {
          url: '/clients/',
          templateUrl: 'views/clients/list.html',
          controller: 'ClientsListCtrl',
          data: {
            access: access.public
          }
        })
        .state('config.clients.details', {
          url: '/clients/:client_id/:mode/',
          templateUrl: 'views/clients/details.html',
          controller: 'ClientDetailsCtrl',
          data: {
            access: access.clients_manager
          }
        })
        .state('config.groups', {
          abstract: true,
          templateUrl: 'views/config.stump.html',
          controller: 'MainCtrl',
          data: {
            access: access.public
          }
        })
        .state('config.groups.list', {
          url: '/groups/',
          templateUrl: 'views/groups/list.html',
          controller: 'GroupsListCtrl',
          data: {
            access: access.public
          }
        })
        .state('config.groups.details', {
          url: '/groups/:code/:mode/',
          templateUrl: 'views/groups/details.html',
          controller: 'GroupDetailsCtrl',
          data: {
            access: access.groups_manager
          }
        })
        .state('config.tokens', {
          abstract: true,
          templateUrl: 'views/config.stump.html',
          controller: 'MainCtrl',
          data: {
            access: access.public
          }
        })
        .state('config.tokens.list', {
          url: '/tokens/',
          templateUrl: 'views/tokens/list.html',
          controller: 'TokensListCtrl',
          data: {
            access: access.tokens_reader
          }
        })
        .state('config.tokens.details', {
          url: '/tokens/:token_key/:mode/',
          templateUrl: 'views/tokens/details.html',
          controller: 'TokenDetailsCtrl',
          data: {
            access: access.tokens_manager
          }
        });

      // FIX for trailing slashes. Gracefully 'borrowed' from https://github.com/angular-ui/ui-router/issues/50
      $urlRouterProvider.rule(function ($injector, $location) {
        if ($location.protocol() === 'file') {
          return;
        }

        // Note: misnomer. This returns a query object, not a search string
        var path = $location.path(),
          search = $location.search(),
          params = [];

        // check to see if the path already ends in '/'
        if (path[path.length - 1] === '/') {
          return;
        }

        // If there was no search string / query params, return with a `/`
        if (Object.keys(search).length === 0) {
          return path + '/';
        }

        // Otherwise build the search string and return a `/?` prefix
        angular.forEach(search, function (v, k) {
          params.push(k + '=' + v);
        });
        return path + '/?' + params.join('&');
      });

      $locationProvider.html5Mode(true);
      $httpProvider.interceptors.push('OAuthInterceptor');
    }])
  .run(['$rootScope', '$state', 'Auth', '$location',
    function ($rootScope, $state, Auth, $location) {
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (!Auth.authorize(toState.data.access)) {

          event.preventDefault();

          if (fromState.url === '^') {
            if (Auth.isLoggedIn()) {
              $state.go('config.clients.list');
            } else {
              $state.transitionTo('login', {continue: $location.url()});
            }
          }
          throw {
            message: 'Sorry, but you don\'t have enough permissions',
            namespace: 'state'
          };
        }
      });
    }])
  .run(['Restangular', '$location', '$injector',
    function (Restangular, $location, $injector) {
      Restangular.setErrorInterceptor(function (resp) {
        if (!!resp.status && resp.status > 300) {
          var $location = $injector.get('$location');
          var $state = $injector.get('$state');
          var message = null;
          var namespace = 'http';
          switch (resp.status) {
            case 401:
              message = !!resp.data.error ? resp.data.error + ' : ' + resp.data.messages[0] : 'Error: ' + resp.status;
              break;
            case 403:
              message = 'Sorry, but you don\'t have enough permissions';
              break;
            case 500:
              message = 'Internal server error. Please try again later.';
              break;
            default :
              message = !!resp.data.error ? resp.data.error + ' : ' + resp.messages[0] : 'Error: ' + resp.status;
              break;
          }
          $injector.invoke(['$rootScope', function ($rootScope) {
            $rootScope.$broadcast(namespace, message);
          }]);
        }
        return resp; // stop the promise chain
      });
    }])
  .run(['Restangular', '$injector',
    function (Restangular, $injector) {
      Restangular.setRequestInterceptor(function (element, operation, route, url) {
        $injector.invoke(['$rootScope', function ($rootScope) {
          $rootScope.$broadcast('error:clean');
        }]);
        return element;
      });
    }])
  .config(['$provide', function ($provide) {
    $provide.decorator('$exceptionHandler', ['$delegate', '$injector', function ($delegate, $injector) {
      return function (exception, cause) {
        if (!!exception.namespace) {
          $injector.invoke(['$rootScope', function ($rootScope) {
            $rootScope.$broadcast(exception.namespace, exception.message);
          }]);
        }
        $delegate(exception, cause);
      };
    }]);
  }]);
