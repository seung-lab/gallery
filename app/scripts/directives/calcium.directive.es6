'use strict';
  
app.directive('calcium', [ '$timeout', 'cells', function ($timeout, cells) {

  var chartLinker = function (scope, element, attrs) {
      scope.init().then(function (cells) {
        let canvas = angular.element(element).find('canvas')[0];
        let ctx = canvas.getContext('2d');

        cells = cells.filter( (cell) => cell.calcium );

        let angles = Object.keys(cells[0].calcium.activations[scope.activation]).map( (angle) => parseInt(angle, 10));
        angles.sort();

        scope.chart = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: angles,
            datasets: cells.map(function (cell) {
              return  {
                label: cell.id,
                fill: false,
                lineTension: 0,
                borderWidth: 1,
                backgroundColor: cell.color,
                borderColor: cell.color,
                pointRadius: 1,
                pointBackgroundColor: cell.color,
                pointBorderColor: cell.color,
                pointHoverBackgroundColor: cell.color,
                pointHoverBorderColor: cell.color,
                data: angles.map(function (angle) {
                  return cell.calcium.activations[scope.activation][angle];
                }),
              };
            }),
          },
          options: {
            showLines: true,
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
   

