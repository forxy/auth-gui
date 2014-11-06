'use strict';

angular.module('controllers.client', [])

  .controller('ClientsListCtrl', ['$scope', '$modal', '$stateParams', 'Client',
    function ($scope, $modal, $stateParams, Client) {
      $scope.totalPages = 0;
      $scope.clientsCount = 0;
      $scope.headers = [
        {
          title: 'ClientID',
          value: '_id'
        },
        {
          title: 'Application Name',
          value: 'name'
        },
        {
          title: 'Updated By',
          value: 'updated_by'
        },
        {
          title: 'Created By',
          value: 'created_by'
        },
        {
          title: 'Update Date',
          value: 'update_date'
        },
        {
          title: 'Create Date',
          value: 'create_date'
        }
      ];

      $scope.filterCriteria = {
        page: 1,
        sort_dir: 'ASC',
        sorted_by: 'name'
      };

      //The function that is responsible of fetching the result from the server and setting the grid to the new result
      $scope.fetchResult = function () {
        return Client.page($scope.filterCriteria).then(function (response) {
          $scope.clients = response.content;
          $scope.totalPages = Math.ceil(response.total / response.size);
          $scope.clientsCount = response.total;
        }, function () {
          $scope.clients = [];
          $scope.totalPages = 0;
          $scope.clientsCount = 0;
        });
      };

      //called when navigate to another page in the pagination
      $scope.selectPage = function (page) {
        $scope.filterCriteria.page = page;
        $scope.fetchResult();
      };

      //Will be called when filtering the grid, will reset the page number to one
      $scope.filterResult = function () {
        $scope.filterCriteria.page = 1;
        $scope.fetchResult().then(function () {
          //The request fires correctly but sometimes the ui doesn't update, that's a fix
          $scope.filterCriteria.page = 1;
        });
      };

      //call back function that we passed to our custom directive sortBy, will be called when clicking on any field to sort
      $scope.onSort = function (sortedBy, sortDir) {
        $scope.filterCriteria.sort_dir = sortDir;
        $scope.filterCriteria.sorted_by = sortedBy;
        $scope.filterCriteria.page = 1;
        $scope.fetchResult().then(function () {
          //The request fires correctly but sometimes the ui doesn't update, that's a fix
          $scope.filterCriteria.page = 1;
        });
      };
      $scope.remove = function (client) {
        Client.delete(client).then(function (response) {
          $scope.fetchResult();
        }, function (response) {
        });
      };

      //manually select a page to trigger an ajax request to populate the grid on page load
      $scope.selectPage(1);
    }])

  .controller('ClientDetailsCtrl', ['$scope', '$state', '$stateParams', 'Client', 'AlertMgr',
    function ($scope, $state, $stateParams, Client, AlertMgr) {
      $scope.mode = $stateParams.mode;

      $scope.client = {
        name: '',
        secret: '',
        description: '',
        web_uri: '',
        redirect_uris: [],
        scopes: []
      };
      $scope.original = angular.copy($scope.client);

      if ($scope.mode === 'edit') {
        Client.get($stateParams.client_id).then(function (response) {
          if (response) {
            $scope.client = response;
            $scope.client.redirect_uris = $scope.client.redirect_uris || [];
            $scope.client.scopes = $scope.client.scopes || [];
            $scope.original = angular.copy($scope.client);
          }
        }, function () {
        });
      }

      $scope.discard = function () {
        $scope.client = angular.copy($scope.original);
      };

      $scope.save = function () {
        $scope.original = angular.copy($scope.client);
        if ($scope.mode === 'new') {
          Client.add($scope.client).then(function (response) {
            $state.go('client.details', {client_id: $scope.client.client_id, mode: 'edit'});
          }, function (error) {
            error.data.messages.forEach(function (item) {
              AlertMgr.addAlert('danger', item);
            });
          });
        } else if ($scope.mode === 'edit') {
          $scope.client.save();
        }
      };

      $scope.isCancelDisabled = function () {
        return angular.equals($scope.original, $scope.client);
      };

      $scope.isSaveDisabled = function () {
        return $scope.client_form.$invalid || angular.equals($scope.original, $scope.client);
      };

      $scope.discard();
    }]);
