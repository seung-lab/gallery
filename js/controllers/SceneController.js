// Manages the 3D Scene for the cells
app.controller('SceneController', ['$scope', 'CellService', 'CameraService',
  function ($scope, CellService, CameraService) {
      $scope.camera = { x:10000 , y:10000, z:10000};
     
      var cells = new Set();
      $scope.cellID = 11;


      $scope.addCell = function () {

          if(!cells.has($scope.cellID)){
              cells.add($scope.cellID);
              CellService.addCell($scope.cellID);
          }
      }

      $scope.removeCell = function () {

          if(cells.has($scope.cellID)){
              cells.delete($scope.cellID);
              CellService.removeCell($scope.cellID);
          }
      }

      $scope.moveCamera = function () {
          CameraService.perspectiveCam.position.x = $scope.camera.x;
          CameraService.perspectiveCam.position.y = $scope.camera.y;
          CameraService.perspectiveCam.position.z = $scope.camera.z;
      }
      // brings camera out
      $scope.increaseCameraZ = function () {
          CameraService.perspectiveCam.position.z += 50;
      }

      //brings camera in
      $scope.decreaseCameraZ = function () {
          CameraService.perspectiveCam.position.z -= 50;
      }
}]);
