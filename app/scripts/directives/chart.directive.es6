'use strict';
  
app.directive('chart', [ '$timeout', 'cells', function ($timeout, cells) {

  function range (a, b, step = 1) {
    let rng = [];
    for (let i = a; i < b; i += step) {
      rng.push(i);
    }

    return rng;
  }
        
  var chartLinker = function (scope, element, attrs) {
      scope.$on('$destroy', function () {
          $timeout(function () {
              if (angular.isDefined(scope.chart)) {
                  scope.chart = scope.chart.destroy();
              }
          }, 10000);
      });

      scope.init().then(function (cells) {
        let canvas = angular.element(element).find('canvas')[0];
        let ctx = canvas.getContext('2d');

        scope.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: range(0, cells[0].stratification.length),
            datasets: cells.map(function (cell) {
              return {
                label: cell.id,
                fill: false,
                lineTension: 0,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 1,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: cell.stratification,
              };
            }),
          },
          options: {
            showLines: true,
            legend: {
              onClick: function (evt, obj) {
                scope.onLegendClick({ 
                  cell_id: parseInt(obj.text, 10),
                });
              },
              onHover: function (evt, obj) { // custom feature, had to modify library
                scope.onLegendMouseover({
                  cell_id: parseInt(obj.text, 10),
                });
              },
            },
            hover: {
              onHover: function () {
                scope.onLegendMouseout();
              },
            },
          },
        });
      });
  };

  return {
    restrict: "E",
    scope: {
        bindto: "@bindtoId",
        chart: "=",
        onLegendClick: '&',
        onLegendMouseover: '&',
        onLegendMouseout: '&',
        init: "&",
    },
    template: `<div>
      <canvas id='{{bindto}}'></canvas>
      <div ng-transclude></div>
    </div>`,
    replace: false,
    transclude: true,
    link: chartLinker,
  };

}]);
   

