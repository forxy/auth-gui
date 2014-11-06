'use strict';

angular.module('directives.on-blur-change', [])

  .directive('onBlurChange', ['$parse', function ($parse) {
    return function (scope, element, attr) {
      var fn = $parse(attr['onBlurChange']);
      var hasChanged = false;
      element.on('change', function (event) {
        hasChanged = true;
      });

      element.on('blur', function (event) {
        if (hasChanged) {
          scope.$apply(function () {
            fn(scope, {$event: event});
          });
          hasChanged = false;
        }
      });
    };
  }]);
