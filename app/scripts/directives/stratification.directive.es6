'use strict';
  
app.directive('stratification', function () {

  var chartLinker = function (scope, element, attrs) {
    
    scope.chart = makeChart(scope, element);
    
    scope.$watch(function (scope) {
      return scope.cells.map( (cell) => cell.id ).join('');
    }, function () {
      let datasets = createDatasets(scope.cells);
      scope.chart.config.data.datasets = datasets;
      scope.chart.config.options.scales.yAxes[0].ticks.max = computeMaxlabel(datasets);
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

      dataset.hidden = false;

      if (!cell.highlight && cell.hidden) {
        //color = "rgba(0,0,0,0)";
        dataset.hidden = true;
      }
      else if (!cell.highlight && any) {
        dataset.hidden = true;
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

  function computeMaxlabel (datasets) {
   let max = 0;

    let data, y;
    for (let i = datasets.length - 1; i >= 0; i--) {
      data = datasets[i].data;
      for (let j = data.length - 1; j >= 0; j--) {
        y = data[j].y;
        max = (y > max && y) || max;
      }
    }

    let explabel = max.toExponential();
    let firstsigfig = Number(explabel[0]) + 1;
    let matches = explabel.match(/e([+-]\d+)/);
    let magnitude = Number(matches[1]);
    return firstsigfig * Math.pow(10, magnitude);
  }

  function makeChart (scope, element) {
    let cells = scope.cells;

    let canvas = angular.element(element).find('canvas')[0];
    let ctx = canvas.getContext('2d');

    cells = cells.filter( (cell) => cell.stratification );

    let datasets = createDatasets(cells);

    return new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: datasets,
      },
      options: {
        responsive: true,
        animation: {
          duration: 0,
        },
        showLines: true,
        scales: {
          yAxes: [{
            // scaleLabel: {
            //   display: true,
            //   labelString: "Dogecoin in USD",
            //   fontSize: 14,
            // },
             ticks: {
              min: 0,
              max: computeMaxlabel(datasets),
            },
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: "% IPL Depth",
              fontSize: 12,
            },
            ticks: {
              min: -20,
              max: 120,
            },
          }],
        },
        legend: {
          display: false,
        },
      },
    });
  }

  function createDatasets (cells) {
    cells = cells.filter( (cell) => cell.stratification && !cell.hidden );

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

});
   

