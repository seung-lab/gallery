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
          type: 'scatter',
          data: {
            //labels: range(0, cells[0].stratification.length),
            datasets: cells.map(function (cell) {
              let data = [];
              for (let i = 0; i < cell.stratification.length; i++) {
                data.push({ x: i, y: cell.stratification[i] });
              }

              return {
                label: cell.id,
                fill: false,
                lineTension: 0,
                backgroundColor: cell.color,
                borderColor: cell.color,
                borderWidth: 1,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: cell.color,
                pointBackgroundColor: cell.color,
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: cell.color,
                pointHoverBorderColor: cell.color,
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: data,
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
   

