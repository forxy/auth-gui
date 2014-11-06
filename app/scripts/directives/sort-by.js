'use strict';

angular.module('directives.sort-by', [])

  .directive('sortBy', function () {
    return {
      templateUrl: 'views/components/sort-by.html',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        sortdir: '=',
        sortedby: '=',
        sortvalue: '@',
        onsort: '='
      },
      link: function (scope, element, attrs) {
        scope.sort = function () {
          if (scope.sortedby === scope.sortvalue) {
            scope.sortdir = scope.sortdir === 'ASC' ? 'DESC' : 'ASC';
          } else {
            scope.sortedby = scope.sortvalue;
            scope.sortdir = 'ASC';
          }
          scope.onsort(scope.sortedby, scope.sortdir);
        };
      }
    };
  });
