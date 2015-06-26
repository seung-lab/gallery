// Adds a new model to the viewer with the provided x, y offset from the UI.  This specific model
// creates a tube that follows a collection of 3d points.
app.service('CellService', ['Scene3DService', 'OctLODFactory', function (SceneService, OctLOD) {

  this.cells = Array();
  this.addCell = function (cellID) {

    this.cells.push(new OctLOD(cellID, 8 , 0, 0 , 0));
  }

  this.removeCell = function (cellID) {

      for (var index=0; index <  SceneService.scene.children.length ; index++){
          var object = SceneService.scene.children[index];
          if (object.name == cellID){
              SceneService.scene.remove(object);
              index--;
          }                       
      }
  }
}]);


