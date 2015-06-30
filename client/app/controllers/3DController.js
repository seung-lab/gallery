'use strict';
// Manages the 3D Scene for the cells
( function (app) {
app.controller('3DController', ['$scope', 'CellService', 'Coordinates3DService',
  function ($scope, CellService, CoordinatesService) {


  this.watch = function() {
    $scope.$watch('s.toggleGround', function(show) {
      show ? CoordinatesService.drawGround({size:10000}) : CoordinatesService.removeGround();
    });

    $scope.$watch('s.toggleAxes', function(show) {
      show ? CoordinatesService.drawAllAxes({axisLength:1000,axisRadius:50,axisTess:50}) : CoordinatesService.removeAxes();
    });

    $scope.$watch('s.toggleYZGrid', function(show) {
      show ? CoordinatesService.drawGrid({size:10000,scale:0.001, orientation:"x"}) : CoordinatesService.removeGrid('x');
    });

    $scope.$watch('s.toggleXZGrid', function(show) {
      show ? CoordinatesService.drawGrid({size:10000,scale:0.001, orientation:"y"}) : CoordinatesService.removeGrid('y');
    });

    $scope.$watch('s.toggleXYGrid', function(show) {
      show ? CoordinatesService.drawGrid({size:10000,scale:0.001, orientation:"z"}) : CoordinatesService.removeGrid('z');
    });
  };
  this.watch();

}]);

})(app);
