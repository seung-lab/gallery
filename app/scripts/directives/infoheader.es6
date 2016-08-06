'use strict';
  
app.directive('infoheader', [function () {
  return {
    restrict: "E",
    scope: {},
    template: `<div>
      <h2 ng-click="onscreen = !onscreen">{{heading}}</h2>
      <div ng-click="onscreen = !onscreen" class="more">
        {{ onscreen ? '&mdash;' : ' +' }}
      </div>
      <div ng-transclude ng-class='{ rollup: true, onscreen: onscreen }'></div>
    </div>`,
    replace: false,
    transclude: true,
    link: function (scope, element, attrs) {
      scope.onscreen = false;
      scope.heading = attrs.heading;
    },
  };

}]);
   

