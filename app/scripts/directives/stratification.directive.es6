'use strict';
  
app.directive('stratification', [ '$timeout', 'cells', function ($timeout, cells) {

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
              let data = [];
              for (let i = 0; i < cell.stratification.length; i++) {
                data.push({ x: i, y: cell.stratification[i] });
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
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: color,
                pointBackgroundColor: color,
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: color,
                pointHoverBorderColor: color,
                pointHoverBorderWidth: 2,
                pointRadius: 1,
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
   

