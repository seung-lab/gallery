'use strict';

app.directive('chart', function () {

    return {
      restrict: 'E',
      template: '<canvas></canvas>',
      scope: {
        chartObject: "=value"
      },
      link: function (scope, element, attrs) {
        var canvas  = element.find('canvas')[0];
        var context = canvas.getContext('2d');
        var chart;

        var options = {
          type:   attrs.type   || "Line",
          width:  attrs.width  ,
          height: attrs.height ,
          responsive: true
        };
        canvas.width = options.width;
        canvas.height = options.height;
        chart = new Chart(context);

        //Update when charts data changes
        scope.$watch(function() { return scope.chartObject; }, function(value) {
          if (!value) return;
          var chartType = options.type;
          chart[chartType](scope.chartObject.data, scope.chartObject.options);
          if (scope.chartInstance) scope.chartInstance.destroy();
          scope.chartInstance = chart[chartType](scope.chartObject.data, scope.chartObject.options);
        }, true);
      }
    }
  });
