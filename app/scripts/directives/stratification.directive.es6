'use strict';
  
app.directive('stratification', [ '$timeout', 'cellService', function ($timeout, cellService) {

  var chartLinker = function (scope, element, attrs) {
      init(scope).then(function () {
        makeChart(scope, element);
      });

      scope.$watch(function (scope) {
        return scope.cells.map( (cell) => cell.id ).join('');
      }, function () {
        scope.chart.config.data.datasets = createDatasets(scope.cells);
        scope.chart.update(0, true);
      });
  };

  function init (scope) {
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

    return cellService.get(scope.cellids).then(function (cells) {
      scope.cells.push.apply(scope.cells, cells);
      return cells;
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

      if (cell.hidden) {
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
    let cells = scope.cells;

    let canvas = angular.element(element).find('canvas')[0];
    let ctx = canvas.getContext('2d');

    cells = cells.filter( (cell) => cell.stratification );

    scope.chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: createDatasets(cells),
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
        },
      },
    });
  }

  function createDatasets (cells) {
    cells = cells.filter( (cell) => cell.stratification );

    return cells.map(function (cell) {

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
    });
  }

  return {
    restrict: "E",
    scope: {
        cells: "="
    },
    template: `<div>
      <canvas></canvas>
    </div>`,
    replace: false,
    transclude: false,
    link: chartLinker,
  };

}]);
   

