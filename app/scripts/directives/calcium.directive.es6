'use strict';
  
app.directive('calcium', [ function () {

  var chartLinker = function (scope, element, attrs) {
    scope.chart = makeChart(scope, element);
    
    scope.$watch(function (scope) {
      return scope.cells.map( (cell) => cell.id ).join('');
    }, 
    function (value) {
      scope.chart.config.data.datasets = makeDatasets(scope.cells, scope.activation);
      scope.chart.update(0, true);
    });

    scope.$watch(function (scope) {
      return scope.cells.map( (cell) => cell.hidden ? 't' : 'f' ).join('');
    }, 
    function (value) {
      updateChartColors(scope);
    });

    scope.$watch(function (scope) {
      return scope.cells.map( (cell) => cell.highlight ? 't' : 'f' ).join('');
    }, 
    function (value) {
      updateChartColors(scope);
    });
  };

  function updateChartColors (scope) {
    if (!scope.chart) {
      return;
    }

    let dict = {};
    let any = false;
    scope.cells.forEach(function (cell) {
      any = any || cell.highlight;
      dict[cell.id + ""] = cell;
    });

    scope.chart.config.data.datasets.forEach(function (dataset) {
      let cell = dict[dataset.label];
      let color = cell.color;

      if (scope.cells.length === 1) {
        color = '#1A1A1A';
      }

      if (!cell.highlight && cell.hidden) {
        color = "rgba(0,0,0,0)";
      }
      else if (!cell.highlight && any) {
        color = ColorUtils.toRGBA(color, 0.25);
      }

      [
        'backgroundColor',
        'pointBackgroundColor',
        'pointHoverBackgroundColor',
        'pointBorderColor',
        'borderColor',
        'pointHoverBorderColor'
      ].forEach(function (prop) {
        dataset[prop] = color;
      })
    });

    scope.chart.update(0, true);
  }

  function makeChart (scope, element) {
    let canvas = angular.element(element).find('canvas')[0];
    let ctx = canvas.getContext('2d');

    let angles = makeLabels(scope.cells, scope.activation);    

    return new Chart(ctx, {
      type: 'radar',
      data: {
        labels: angles,
        datasets: makeDatasets(scope.cells, scope.activation),
      },
      options: {
        responsive: true,
        showLines: true,
        animation: {
          duration: 0,
        },
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
        },
      },
    });
  }

  function makeLabels (cells, activation) {
    cells = cells.filter( (cell) => cell.calcium );

    let angles = [ 360, 45, 90, 135, 180, 225, 270, 315 ];

    if (cells.length) {
      angles = Object.keys(
        cells[0].calcium.activations[activation]
      ).map( (angle) => parseInt(angle, 10));
      
      angles.sort( (a,b) => a - b );
    }

    if (angles[angles.length - 1] === 360) {
      angles.unshift(angles.pop());
    }

    return angles;
  }

  function makeDatasets (cells, activation) {
    cells = cells.filter( (cell) => cell.calcium );

    let angles = makeLabels(cells, activation);

    return cells.map(function (cell) {
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
          return cell.calcium.activations[activation][angle];
          // return fmt(cell.calcium.activations[activation][angle], 1e4)
        }),
      };
    });
  }

  return {
    restrict: "E",
    scope: {
        activation: "@activation",
        cells: "=",
    },
    template: `<div>
      <canvas></canvas>
    </div>`,
    replace: false,
    transclude: false,
    link: chartLinker,
  };

}]);
   

