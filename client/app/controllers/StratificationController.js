'use strict';
(function (app, THREE) {

app.controller('StratificationController', ['$rootScope','$scope',
  function($rootScope, $scope){

    // var labels = [];
    // for (var i = 0 ; i < 100; ++i){
    //   labels.push(i / 100.0);
    // }


    // $scope.$on('visible', function(event, args) {

    //   var datasets = [];
    //   for (var id in $scope.visible) {
    //     var index = $scope.cells.getIndex(id);
    //     var cell  = $scope.cells[index];

    //     var color = new THREE.Color(cell.color);
    //     datasets.push({
    //       fillColor: 'rgba('+color.r*255+','+color.g*255+','+color.b*255+',0.1)',
    //       pointColor: cell.color,
    //       strokeColor: cell.color,
    //       pointStrokeColor : "#fff",    
    //       data: cell.stratification
    //     });
    //   }

    //   var data = {
    //     labels : labels,         
    //     datasets : datasets
    //   };
      
    //   var options = {
    //     scaleOverride: true,
    //     scaleSteps: 10,
    //     scaleStepWidth: 0.1,
    //     scaleStartValue: 0.0,
    //     reponsive: true,
    //     showTooltips: false,
    //     showXLabels: 10
    //   };

    //   $scope.stratification = {"data": data, options: options};
    //   console.log()
    // });

    // $scope.datapoints=[{"x":10,"top-1":10,"top-2":15},
    //                    {"x":20,"top-1":100,"top-2":35},
    //                    {"x":30,"top-1":15,"top-2":75},
    //                    {"x":40,"top-1":50,"top-2":45}];
    // $scope.datacolumns=[{"id":"top-1","type":"line"},
    //                     {"id":"top-2","type":"spline"}];
    // $scope.datax={"id":"x"};

 }]);

})(app, THREE);

