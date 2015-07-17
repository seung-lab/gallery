'use strict';
// Adds a new model to the viewer with the provided x, y offset from the UI.  This specific model
// creates a tube that follows a collection of 3d points.
( function (app) { 

app.service('CellService', ['$rootScope','Scene3DService', 'SetFactory',
 function ($rootScope, Scene, setOperations) {

  var old_visible = new Set();


  this.toggle = function( cellId ) {

    var cell = $rootScope.cells.get(cellId);
    
    if (cell.visible === true) {
      var new_visible = new Set(old_visible);
      new_visible.delete( cellId );
    } 
    else {
      var new_visible =  new Set(old_visible);
      new_visible.add( cellId );
    }
    broadcastVisibleSet( new_visible );

  }

  function broadcastVisibleSet( new_visible) {

    var added = setOperations.complement(new_visible,old_visible);
    added.forEach(function(cellID){
        old_visible.add(cellID);
        addCellMesh(cellID);
    });

    var removed = setOperations.complement(old_visible,new_visible);
    removed.forEach(function(cellID){
        old_visible.delete(cellID);
        removeCellMesh(cellID);
    });

    $rootScope.visible = old_visible;
    $rootScope.added = added;
    $rootScope.removed = removed;
    $rootScope.$broadcast('visible');
  }


  function updateVisibleCells () {
    $rootScope.$watch('r.setId', function(setId){
      if(!setId){
        return;
      }
      var set = $rootScope.sets.get(setId);
      var new_visible = new Set(set.children);

      broadcastVisibleSet( new_visible );

    });

    $rootScope.$watch("r.cellId", function(cellId){
      if ($rootScope.viewSlide.model == "catalog" && cellId != undefined){

        var new_visible = new Set([cellId,]);
        broadcastVisibleSet ( new_visible );

      }

    });
  }
  updateVisibleCells();


  function createCell ( cellId, callback ) {

    var cell = $rootScope.cells.get(cellId);

    var url = '/api/mesh/'+cell.segment;

    var ctm = new THREE.CTMLoader(true);
    ctm.load( url , function(geometry){

      var material = new THREE.MeshLambertMaterial( { color:cell.color , wireframe:false } );
      cell.mesh = new THREE.Mesh( geometry, material );
      cell.mesh.scale.set(0.05,0.05,0.05)
      Scene.scene.add( cell.mesh );

      cell.mesh.visible = cell.visible;      
    }, { 'useWorker': true} );

  };

  var addCellMesh = function (cellId) {

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
  };

  var removeCellMesh = function (cellId) {

    var cell = $rootScope.cells.get(cellId);

    if (cell.visible === undefined || cell.visible === false) {
      return;
    }

    if ( cell.mesh !== undefined ) {
      cell.mesh.visible = false;
    }

    cell.visible = false;
  };

  
}]);

})(app);

