'use strict';

angular.module('directives.error-handling', [])

  .directive('errorHandling', function () {
    return {
      template: '<div ng-if="!!currentError && !usePopover" class="alert alert-danger">{{currentError}}</div>' +
      '<div ng-if="(!currentError && !usePopover) || !!usePopover" ng-transclude></div>',
      restrict: 'EA',
      transclude: true,
      replace: false,
      scope: {
        namespace: '@',
        usePopover: '@',
        placement: '@'
      },
      link: function ($scope, el, attrs) {
        $scope.currentError = null;

        $scope.clearError = function () {
          $scope.currentError = null;
          if (!!$scope.usePopover) {
            $(el).popover('destroy');
          }
        };

        $scope.$on($scope.namespace || 'error', function (e, errorMessage) {
          $scope.currentError = errorMessage;
          if (!!$scope.usePopover) {
            $(el).popover({
              trigger: 'manual',
              html: true,
              content: '<div class="alert alert-pupup alert-danger">' + $scope.currentError + '</div>',
              placement: $scope.placement || 'top',
              label: 'Error'
            });
            $(el).popover('show')
          }
        });

        $scope.$on('error:clean', function () {
          $scope.clearError();
        });
      }
    };
  });
