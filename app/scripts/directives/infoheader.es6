'use strict';
  
app.directive('infoheader', [function () {
  return {
    restrict: "E",
    scope: {},
    template: `<div ng-class="{ nofollowing: nofollowing }">
      <h2 ng-click="onscreen = !onscreen">{{heading}}</h2>
      <hr>
      <div ng-click="onscreen = !onscreen" ng-class="{ more: true, onscreen: !nomore }">
        {{ onscreen ? '&mdash;' : ' +' }}
      </div>
      <div ng-transclude ng-class='{ insertpoint: true, rollup: true, onscreen: onscreen }'></div>
    </div>`,
    replace: false,
    transclude: true,
    link: function (scope, element, attrs) {
      scope.onscreen = false;
      scope.heading = attrs.heading;
      scope.nofollowing = !!attrs.nofollowing;
      scope.nomore = !!attrs.nomore;
    },
  };

}]);
   

