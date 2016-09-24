'use strict';
  
app.directive('credit', [function () {
  return {
    restrict: "E",
    scope: {},
    template: `<div>
      <img ng-if="!!src" ng-src={{src}} />
      <div ng-transclude="name"></div>
      <div ng-transclude="description"></div>
    </div>`,
    replace: false,
    transclude: {
      name: "creditName",
      description: "creditDescription",
    },
    link: function (scope, element, attrs) {
      scope.src = attrs.imgsrc;
    },
  };

}]);
   

