'use strict';
// Adds a new model to the viewer with the provided x, y offset from the UI.  This specific model
// creates a tube that follows a collection of 3d points.
( function (app) { 

app.service('CellService', ['$rootScope','Scene3DService', 'ctmFactory',
 function ($rootScope, Scene, ctm) {

  function createCell ( cellId, callback ) {

    var cell = $rootScope.cells.get(cellId);

    var url = '/api/mesh/'+cell.segment;

    new ctm(url , function(geometry) {

      var material = new THREE.MeshLambertMaterial( { color:cell.color , wireframe:false } );
      cell.mesh = new THREE.Mesh( geometry, material );
      cell.mesh.scale.set(0.05,0.05,0.05)
      Scene.scene.add( cell.mesh );

      cell.mesh.visible = cell.visible;      
    });

  };

  this.addCell = function (cellId) {

    var cell = $rootScope.cells.get(cellId);
    if (cell.visible === true) {
        return;
    }


    if ( cell.visible === undefined ) {
      createCell(cellId);
    } 


    if ( cell.mesh !== undefined ) {
      cell.mesh.visible = true;
    }

    cell.visible = true;
     
    $rootScope.$broadcast('visible');
    $rootScope.$broadcast('cell-load', cellId);

  };

  this.removeCell = function (cellId) {

    var cell = $rootScope.cells.get(cellId);

    if (cell.visible === undefined || cell.visible === false) {
      return;
    }

    if ( cell.mesh !== undefined ) {
      cell.mesh.visible = false;
    }

    cell.visible = false;

    $rootScope.$broadcast('visible');
    $rootScope.$broadcast('cell-unload', cellId);
  };

  
}]);

})(app);

