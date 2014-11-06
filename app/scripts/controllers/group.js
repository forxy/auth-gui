'use strict';

angular.module('controllers.group', [])

  .controller('GroupsListCtrl', ['$scope', '$modal', '$stateParams', 'Group',
    function ($scope, $modal, $stateParams, Group) {
      $scope.totalPages = 0;
      $scope.groupsCount = 0;
      $scope.headers = [
        {
          title: 'Code',
          value: 'code'
        },
        {
          title: 'Group Name',
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
        return Group.page($scope.filterCriteria).then(function (response) {
          $scope.groups = response.content;
          $scope.totalPages = Math.ceil(response.total / response.size);
          $scope.groupsCount = response.total;
        }, function () {
          $scope.groups = [];
          $scope.totalPages = 0;
          $scope.groupsCount = 0;
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
      $scope.remove = function (group) {
        Group.delete(group).then(function (response) {
          $scope.fetchResult();
        }, function (response) {
        });
      };

      //manually select a page to trigger an ajax request to populate the grid on page load
      $scope.selectPage(1);
    }])

  .controller('GroupDetailsCtrl', ['$scope', '$state', '$stateParams', 'Group', 'AlertMgr', 'Client',
    function ($scope, $state, $stateParams, Group, AlertMgr, Client) {
      $scope.mode = $stateParams.mode;

      $scope.group = {
        name: '',
        description: '',
        scopes: {}
      };
      $scope.clients = {};
      $scope.original = angular.copy($scope.group);

      if ($scope.mode === 'edit') {
        Group.get($stateParams.code).then(function (response) {
          if (response) {
            $scope.group = response;
            $scope.group.scopes = $scope.group.scopes || {};
            $scope.original = angular.copy($scope.group);
          }
        }, function () {
        });
      }

      Client.all().then(function (response) {
        $scope.clients_list = response;
        for (var i = 0; i < $scope.clients_list.length; i++) {
          $scope.clients[$scope.clients_list[i].client_id] = $scope.clients_list[i];
        }
      }, function () {
      });

      $scope.discard = function () {
        $scope.group = angular.copy($scope.original);
      };

      $scope.save = function () {
        $scope.original = angular.copy($scope.group);
        if ($scope.mode === 'new') {
          Group.add($scope.group).then(function (response) {
            $state.go('group.details', {code: $scope.group.code, mode: 'edit'});
          }, function (error) {
            error.data.messages.forEach(function (item) {
              AlertMgr.addAlert('danger', item);
            });
          });
        } else if ($scope.mode === 'edit') {
          $scope.group.save();
        }
      };

      $scope.addScope = function (client_id, scope) {
        if (!$scope.group.scopes[client_id]) {
          $scope.group.scopes[client_id] = [];
        }
        $scope.group.scopes[client_id].push(scope);
      };
      $scope.removeScope = function (client_id, index) {
        if (!!$scope.group.scopes[client_id]) {
          $scope.group.scopes[client_id].splice(index, 1);
          if ($scope.group.scopes[client_id].length === 0) {
            delete $scope.group.scopes[client_id];
          }
        }
      };
      $scope.hasNoScopes = function () {
        for (var key in $scope.group.scopes) {
          if (!!key) {
            return false;
          }
        }
        return true;
      };


      $scope.isCancelDisabled = function () {
        return angular.equals($scope.original, $scope.group);
      };

      $scope.isSaveDisabled = function () {
        return $scope.group_form.$invalid || angular.equals($scope.original, $scope.group);
      };

      $scope.discard();
    }]);
