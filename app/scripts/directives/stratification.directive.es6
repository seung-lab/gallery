'use strict';
  
app.directive('stratification', [ '$timeout', 'cellService', function ($timeout, cellService) {

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

        cells = cells.filter( (cell) => cell.stratification );

        scope.chart = new Chart(ctx, {
          type: 'scatter',
          data: {
            datasets: cells.map(function (cell) {

              let fmt = (z, factor) => Math.round(z * factor) / factor;

              cell.stratification.sort(function (a, b) {
                return a[0] - b[0];
              });

              let data = [];
              for (let i = 0; i < cell.stratification.length; i++) {
                data.push({ 
                  x: fmt(cell.stratification[i][0], 1e3), 
                  y: fmt(cell.stratification[i][1], 1e7), 
                });
              }

              while (data.length && data[0].y === 0) {
                data.shift();
              }

              while (data.length && data[data.length - 1].y === 0) {
                data.pop();
              }

              let color = cell.color;
              if (cells.length === 1) {
                color = '#1A1A1A';
              }

              return {
                label: cell.id,
                fill: false,
                lineTension: 0,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 1,
                
                borderDash: [],
                borderDashOffset: 0.0,
                
                pointBorderColor: color,
                pointBackgroundColor: color,
                pointBorderWidth: 1,
                pointHoverRadius: 3,
                pointHoverBackgroundColor: color,
                pointHoverBorderColor: color,
                pointHoverBorderWidth: 2,
                pointRadius: 0,
                pointHitRadius: 10,
                data: data,
              };
            }),
          },
          options: {
            showLines: true,
            scales: {
              // yAxes: [{
              //   scaleLabel: {
              //     display: true,
              //     labelString: "Dogecoin in USD",
              //     fontSize: 14,
              //   },
              // }],
              // xAxes: [{
              //   scaleLabel: {
              //     display: true,
              //     labelString: "Day from Start of Year",
              //     fontSize: 14,
              //   },
              // }],
            },
            legend: {
              display: false,
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
   

