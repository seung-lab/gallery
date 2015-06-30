'use strict';
(function (app, THREE) {

app.controller('stratificationController', ['$rootScope','$scope',
  function($rootScope, $scope){

    $scope.$on('visible', function(event, args) {

      var datasets = [];
      for (var id in $scope.visible) {
        var index = $scope.cells.getIndex(id);
        var cell  = $scope.cells[index];

        var color = new THREE.Color(cell.color);
        datasets.push({
          fillColor: 'rgba('+color.r*255+','+color.g*255+','+color.b*255+',0.1)',
          pointColor: cell.color,
          strokeColor: cell.color,
          pointStrokeColor : "#fff",
          data: cell.stratification
        });
      }

      var data = {
        labels : [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0],         
        datasets : datasets
      };
      
      $scope.stratification = {"data": data};
      console.log()
    });

 }]);

})(app, THREE);