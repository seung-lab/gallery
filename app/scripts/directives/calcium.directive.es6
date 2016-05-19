'use strict';
  
app.directive('calcium', [ '$timeout', 'cellService', function ($timeout, cellService) {

  var chartLinker = function (scope, element, attrs) {
      scope.init().then(function (cells) {
        let canvas = angular.element(element).find('canvas')[0];
        let ctx = canvas.getContext('2d');

        cells = cells.filter( (cell) => cell.calcium );

        let angles = [ 360, 45, 90, 135, 180, 225, 270, 315 ];

        if (cells.length) {
          angles = Object.keys(cells[0].calcium.activations[scope.activation]).map( (angle) => parseInt(angle, 10));
          angles.sort( (a,b) => a - b );
        }

        if (angles[angles.length - 1] === 360) {
          angles.unshift(angles.pop());
        }

        scope.chart = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: angles,
            datasets: cells.map(function (cell) {
              let fmt = (z, factor) => Math.round(z * factor) / factor;

              let color = cell.color;
              if (cells.length === 1) {
                color = '#1A1A1A';
              }

              let line_color = ColorUtils.toRGBA(color, 1);

              return  {
                label: cell.id,
                fill: false,
                lineTension: 0,
                borderWidth: 1,
                backgroundColor: color,
                borderColor: line_color,
               
                // not well documented but code requires this 
                // to unset hover state, maybe a library bug
                radius: 2, 
               
                pointRadius: 2,
                pointBorderWidth: 1,
                pointHoverRadius: 3,
                hitRadius: 10,

                pointBackgroundColor: color,
                pointBorderColor: color,
                pointHoverBackgroundColor: color,
                pointHoverBorderColor: color,
                data: angles.map(function (angle) {
                  return cell.calcium.activations[scope.activation][angle];
                  // return fmt(cell.calcium.activations[scope.activation][angle], 1e4)
                }),
              };
            }),
          },
          options: {
            showLines: true,
            scale: {
                scaleLabel: {
                  display: true,
                  fontColor: ColorUtils.toRGBA('#1A1A00', 0.5),
                },
                ticks: {
                  showLabelBackdrop: false,
                  beginAtZero: true,
                  maxTicksLimit: 4,
                  fontColor: ColorUtils.toRGBA('#1A001A', 0.5),
                },
                gridLines: {
                  color: ColorUtils.toRGBA('#001A1A', 0.05),
                  lineWidth: 1,
                },
            },
            legend: {
              display: false,
            }
            // legend: {
            //   onClick: function (evt, obj) {
            //     scope.onLegendClick({ 
            //       cell_id: parseInt(obj.text, 10),
            //     });
            //   },
            //   onHover: function (evt, obj) { // custom feature, had to modify library
            //     scope.onLegendMouseover({
            //       cell_id: parseInt(obj.text, 10),
            //     });
            //   },
            // },
            // hover: {
            //   onHover: function () {
            //     scope.onLegendMouseout();
            //   },
            // },
          },
        });
      });
  };

  return {
    restrict: "E",
    scope: {
        bindto: "@bindtoId",
        activation: "@activation",
        // chart: "=",
        // onLegendClick: '&',
        // onLegendMouseover: '&',
        // onLegendMouseout: '&',
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
   

