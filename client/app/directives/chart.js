'use strict';

(function(app){
  
app.directive('chart', ['$timeout', function ($timeout) {
        
  var chartLinker = function (scope, element, attrs) {

      // Trick to wait for all rendering of the DOM to be finished.
    $timeout(function () {
      var config = {};
      config.bindto = "#" + scope.bindto;
      config.data = {};
      config.data.columns = {};
      config.data.types = {};
      config.data.axes = {};
      config.transition = {
        duration: 0 //Disable animation for faster loading
      };

      scope.chart = c3.generate(config);
 
      scope.$on('$destroy', function () {
          $timeout(function(){
              if (angular.isDefined(scope.chart)) {
                  scope.chart = scope.chart.destroy();
              }
          }, 10000)
      });
  });
  };

  return {
    "restrict": "E",
    "scope": {
        "bindto": "@bindtoId",
        "chart" : "="
    },
    "template": "<div><div id='{{bindto}}'></div><div ng-transclude></div></div>",
    "replace": true,
    "transclude": true,
    "link": chartLinker
  };

}]);
   
})(app);