'use strict';
// Manages the 3D Scene 
( function (app) {

app.controller('3DController', ['$scope', 'Coordinates3DService','Camera3DService','Mesh',
  function ($scope, CoordinatesService, Camera, Mesh) {


  this.watch = function() {
    $scope.$watch('s.toggleGround', function(show) {
      show ? CoordinatesService.drawGround({size:100000}) : CoordinatesService.removeGround();
    });

    $scope.$watch('s.toggleAxes', function(show) {
      show ? CoordinatesService.drawAllAxes({axisLength:10000,axisRadius:500,axisTess:500}) : CoordinatesService.removeAxes();
    });

    $scope.$watch('s.toggleYZGrid', function(show) {
      show ? CoordinatesService.drawGrid({size:1000000,scale:0.00001, orientation:"x"}) : CoordinatesService.removeGrid('x');
    });

    $scope.$watch('s.toggleXZGrid', function(show) {
      show ? CoordinatesService.drawGrid({size:1000000,scale:0.00001, orientation:"y"}) : CoordinatesService.removeGrid('y');
    });

    $scope.$watch('s.toggleXYGrid', function(show) {
      show ? CoordinatesService.drawGrid({size:1000000,scale:0.00001, orientation:"z"}) : CoordinatesService.removeGrid('z');
    });

    $scope.$watch('s.toggleCamera', function(perspective) {
      Camera.setCurrentCamera(perspective);
    });
  };
  this.watch();

}]);

})(app);
