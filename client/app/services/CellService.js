'use strict';
// Adds a new model to the viewer with the provided x, y offset from the UI.  This specific model
// creates a tube that follows a collection of 3d points.
( function (app) { 

app.service('CellService', ['$rootScope','Scene3DService', 'OctLODFactory', 'ctmFactory' ,'Camera3DService',
 function ($rootScope, Scene, OctLOD, ctm, Camera) {

  $rootScope.visible = {};
  $rootScope.invisible = {};
  var fromRTM = false;


  function createCell ( cellID ) {


    if ( fromRTM ){
      $rootScope.visible[cellID] = new OctLOD(cellID, 8 , 0, 0 , 0);

    }
    else {
      $rootScope.visible[cellID] = new ctm(cellID);
    }

  }

  this.addCell = function (cellID) {

    if (cellID in $rootScope.visible){
      return;
    } 
    else if ( cellID in $rootScope.invisible ){
      $rootScope.invisible[cellID].setVisibility(true);
      $rootScope.visible[cellID] = $rootScope.invisible[cellID];
      delete $rootScope.invisible[cellID];
    } 
    else {
      createCell(cellID);
    }

    $rootScope.$broadcast('visible');
    $rootScope.$broadcast('cell-load', cellID);

  };

  this.removeCell = function (cellID) {

    $rootScope.visible[cellID].setVisibility(false);
    $rootScope.invisible[cellID] = $rootScope.visible[cellID];
    delete $rootScope.visible[cellID];

    $rootScope.$broadcast('visible');
    $rootScope.$broadcast('cell-unload', cellID);
  };

  this.updateCells = function() {
    if (!fromRTM) {
      return;
    }

    for( var cellID in $rootScope.visible) {
      $rootScope.visible[cellID].update( Camera.perspectiveCam );
    }
  };
  
}]);

})(app);

