'use strict';
  
app.directive('infoheader', [function () {
  return {
    restrict: "E",
    scope: {
      heading: "@",
      open: "=?"
    },
    template: `<div>
      <h2 ng-click="open = !open">{{heading}}</h2>
      <div class="more">
        {{ open ? '&mdash;' : ' +' }}
      </div>
      <div ng-transclude ng-class='{ rollup: true, onscreen: open }'></div>
    </div>`,
    replace: false,
    transclude: true,
    link: function (scope, element, attrs) {
      scope.open = scope.open || false;
    },
  };

}]);
   

