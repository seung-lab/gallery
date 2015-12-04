'use strict';
// Manages the 3D Scene 
( function (app) {

app.controller('3DController', function ($scope, axes, camera) {

  this.watch = function() {
    $scope.$watch('s.toggleGround', function(show) {
      show ? axes.drawGround({size:100000}) : axes.removeGround();
    });

    $scope.$watch('s.toggleAxes', function(show) {
      show ? axes.drawAllAxes({axisLength:10000,axisRadius:500,axisTess:500}) : axes.removeAxes();
    });

    $scope.$watch('s.toggleYZGrid', function(show) {
      show ? axes.drawGrid({size:1000000,scale:0.00001, orientation:"x"}) : axes.removeGrid('x');
    });

    $scope.$watch('s.toggleXZGrid', function(show) {
      show ? axes.drawGrid({size:1000000,scale:0.00001, orientation:"y"}) : axes.removeGrid('y');
    });

    $scope.$watch('s.toggleXYGrid', function(show) {
      show ? axes.drawGrid({size:1000000,scale:0.00001, orientation:"z"}) : axes.removeGrid('z');
    });

    $scope.$watch('s.toggleCamera', function(perspective) {
      camera.setCurrentCamera(perspective);
    });

    $scope.$watch('s.resetCamera', function() {
      camera.resetCurrentCamera();
    });
  };
  this.watch();

});

})(app);
