'use strict';

(function (app) {
  
app.directive('chart', ['$timeout',
 function ($timeout) {
        
  var chartLinker = function (scope, element, attrs) {

    // Trick to wait for all rendering of the DOM to be finished.
    $timeout(function () {
      var config = {
        bindto: "#" + scope.bindto,
        data: { columns:{}, types :{} , axes: {}  },
        legend:{
          position: 'bottom',
          item: {
            onclick: function (id) {  scope.onLegendClick({cell_id:id}); scope.chart.toggle(id); },
            onmouseover: function (id) { scope.onLegendMouseover({cell_id:id}); },
            onmouseout:  function (id) { scope.onLegendMouseout({cell_id:id}); }
          }
        },
        tooltip: {
          grouped: false
        },
        transition: {
          duration: 0 //Disable animation for faster loading
        },
        point: {
          show: true,
          r:1,
          focus: {
            expand: {
              enabled: true,
              r:4
            }
          }
        },
        grid: {
          x: {
            show: true
          },
          y: {
            show: true
          }
        },     
        size: { //Size seems to be ignore
          height: 240,
          width: scope.width
        },
      };


      scope.chart = c3.generate(config);

 
      scope.$on('$destroy', function () {
          $timeout(function(){
              if (angular.isDefined(scope.chart)) {
                  scope.chart = scope.chart.destroy();
              }
          }, 10000)
      });

      $timeout(function() {scope.init()}, 0);
    });

  };

  return {
    "restrict": "E",
    "scope": {
        "bindto": "@bindtoId",
        "chart" : "=",
        "onLegendClick" : '&',
        "onLegendMouseover": '&',
        "onLegendMouseout": '&',
        "init": "&"

    },
    "template": "<div><div id='{{bindto}}'></div><div ng-transclude></div></div>",
    "replace": false,
    "transclude": true,
    "link": chartLinker
  };

}]);
   
})(app);