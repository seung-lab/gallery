'use strict';
angular.module('threeViewer.controllers', ['threeViewer.services'])

  // Control that manages changes to the 3d scene
.controller('SceneControl', ['$scope', 'ModelFactory', 'CameraService',
    function ($scope, ModelFactory, CameraService) {
        $scope.camera = { x:-6000 , y:75000, z:1000};
       
        var cells = new Set();
        $scope.cellID = 11;

        //ModelFactory.showGrid();

        $scope.addCell = function () {

            if(!cells.has($scope.cellID)){
                cells.add($scope.cellID);
                ModelFactory.addCell($scope.cellID);
            }
        }

        $scope.removeCell = function () {

            if(cells.has($scope.cellID)){
                cells.delete($scope.cellID);
                ModelFactory.removeCell($scope.cellID);
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
