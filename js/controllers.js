'use strict';
angular.module('threeViewer.controllers', ['threeViewer.services'])

  // Control that manages changes to the 3d scene
.controller('SceneControl', ['$scope', 'ModelFactory', 'CameraService',
    function ($scope, ModelFactory, CameraService) {
        $scope.cells = new Set();
        $scope.cellID = 11;

        //ModelFactory.showGrid();

        $scope.addCell = function () {

            console.log($scope.cells);
            if(!$scope.cells.has($scope.cellID)){
                $scope.cells.add($scope.cellID);
                ModelFactory.addCell($scope.cellID);
            }
        }

        $scope.removeCell = function () {

            if($scope.cells.has($scope.cellID)){
                //Remove cell from overview
                $scope.cells.remove($scope.cellID);
            }
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
