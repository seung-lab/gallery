'use strict';
  
app.directive('credit', [function () {
  return {
    restrict: "E",
    scope: {},
    template: `<div>
      <div class="left">
        <div class="image" style="background-image: url({{src}})"></div>
      </div>
      <div class="right">
        <div class="meta">
          <div ng-transclude="name"></div>
          <div ng-transclude="title"></div>
        </div>
        <div ng-transclude="description"></div>
      </div>
    </div>`,
    replace: false,
    transclude: {
      name: "creditName",
      title: "creditTitle",
      description: "creditDescription",
    },
    link: function (scope, element, attrs) {
      scope.src = attrs.src || "/images/ew-black.svg";
    },
  };

}]);
   

