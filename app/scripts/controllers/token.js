'use strict';

angular.module('controllers.token', [])

  .controller('TokensListCtrl', ['$scope', '$modal', 'Token',
    function ($scope, $modal, Token) {
      $scope.totalPages = 0;
      $scope.tokensCount = 0;
      $scope.headers = [
        {
          title: 'Token Key',
          value: 'tokenKey'
        },
        {
          title: 'Client ID',
          value: 'clientID'
        },
        {
          title: 'Type',
          value: 'type'
        },
        {
          title: 'Refresh Token',
          value: 'refreshToken'
        },
        {
          title: 'Subject',
          value: 'subject'
        },
        {
          title: 'Expires In(ms)',
          value: 'expiresIn'
        },
        {
          title: 'Issued At',
          value: 'issuedAt'
        }
      ];

      $scope.filterCriteria = {
        page: 1,
        sortDir: 'ASC',
        sortedBy: 'tokenKey'
      };

      //The function that is responsible of fetching the result from the server and setting the grid to the new result
      $scope.fetchResult = function () {
        return Token.page($scope.filterCriteria).then(function (response) {
          $scope.tokens = response.content;
          $scope.totalPages = Math.ceil(response.total / response.size);
          $scope.tokensCount = response.total;
        }, function () {
          $scope.tokens = [];
          $scope.totalPages = 0;
          $scope.tokensCount = 0;
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
        $scope.filterCriteria.sortDir = sortDir;
        $scope.filterCriteria.sortedBy = sortedBy;
        $scope.filterCriteria.page = 1;
        $scope.fetchResult().then(function () {
          //The request fires correctly but sometimes the ui doesn't update, that's a fix
          $scope.filterCriteria.page = 1;
        });
      };

      //manually select a page to trigger an ajax request to populate the grid on page load
      $scope.selectPage(1);
    }])

  .controller('TokenDetailsCtrl', ['$scope', '$stateParams', 'Token',
    function ($scope, $stateParams, Token) {
      Token.get($stateParams.tokenKey).then(function (response) {
        $scope.token = response;
      }, function (response) {
      });
    }]);
