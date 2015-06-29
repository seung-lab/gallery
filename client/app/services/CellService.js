'use strict';
// Adds a new model to the viewer with the provided x, y offset from the UI.  This specific model
// creates a tube that follows a collection of 3d points.
( function (app) { 

app.service('CellService', ['Scene3DService', 'OctLODFactory','Camera3DService',
 function (Scene, OctLOD, Camera) {

  this.ActiveCells = {};
  this.InactiveCells = {};

  this.addCell = function (cellID) {

    if (cellID in this.ActiveCells){
      return;
    } 
    else if ( cellID in this.InactiveCells ){
      this.InactiveCells[cellID].setVisibility(true);
      this.ActiveCells[cellID] = this.InactiveCells[cellID];
      delete this.InactiveCells[cellID];
    } 
    else {
      this.ActiveCells[cellID] = new OctLOD(cellID, 8 , 0, 0 , 0);
    }
  }

  this.removeCell = function (cellID) {

    this.ActiveCells[cellID].setVisibility(false);
    this.InactiveCells[cellID] = this.ActiveCells[cellID];
    delete this.ActiveCells[cellID];

  }

  this.updateCells = function() {
    for( var cellID in this.ActiveCells) {
      this.ActiveCells[cellID].update( Camera.perspectiveCam );
    }
  }
}]);

})(app);

