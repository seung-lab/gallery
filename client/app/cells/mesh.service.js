'use strict';
// Adds a new model to the viewer with the provided x, y offset from the UI.  This specific model
// creates a tube that follows a collection of 3d points.
( function (app) { 

app.service('Mesh', ['$rootScope','Scene3DService', 'Camera3DService',
 function ($rootScope, Scene, Camera) {


  function createCell ( cellId, callback ) {

    var cell = $rootScope.cells.get(cellId);

    var url = '/api/mesh/'+cell.segment;

    var ctm = new THREE.CTMLoader(false);
    ctm.load( url , function(geometry){

      cell.material =  new THREE.MeshLambertMaterial( { color:cell.color , wireframe:false, transparent:true, opacity:1.0 } );
      cell.mesh = new THREE.Mesh( geometry, cell.material );
      cell.mesh.visible = cell.visible; 
      Scene.get().add( cell.mesh );


      geometry.computeBoundingBox();
      var position  = new THREE.Vector3().addVectors( geometry.boundingBox.max, geometry.boundingBox.min ).multiplyScalar(0.5);
      Camera.lookAt( position );


    }, { 'useWorker': true } );

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
      cell.mesh.visible = true;    }

    cell.visible = true;
    Camera.render();
  };

  var removeCellMesh = function (cellId) {

    var cell = $rootScope.cells.get(cellId);

    if (cell === undefined || cell.visible === false) {
      return;
    }

    if ( cell.mesh !== undefined ) {
      cell.mesh.visible = false;
    }

    cell.visible = false;
    Camera.render();
  };

  var showBoundingBox = function ( geometry ){

    var bbox = geometry.boundingBox;

    var box_geometry = new THREE.BoxGeometry( bbox.max.x - bbox.min.x , bbox.max.y - bbox.min.y , bbox.max.z - bbox.min.z );
    var material = new THREE.MeshBasicMaterial( {color: 0xffffff, wireframe:true} );
    var cube = new THREE.Mesh( box_geometry, material );
    cube.position.set( (bbox.max.x + bbox.min.x)/2.0 , (bbox.max.y + bbox.min.y)/2.0 * scale, (bbox.max.z + bbox.min.z)/2.0 * scale);
    Scene.get().add( cube );

  };

  function setCellOpacity (cellId, opacity ) {

    var cell = $rootScope.cells.get(cellId);

    if ( cell == undefined || cell.mesh == undefined) {
      return;
    }

    if (opacity == 1.0) {

      cell.mesh.material.transparent = false;
      cell.mesh.material.opacity = 1.0;
    
    }
    else {

      cell.mesh.material.transparent = true;
      cell.mesh.material.opacity = opacity;

    }

    cell.mesh.material.needsUpdate = true;

  };

  function watch () {

    $rootScope.$watch('active', function(new_active, old_active) {

      if (new_active == old_active) { //Happens on first call
        old_active = [];  
      }

      var add = _.difference(new_active, old_active);
      for (var i = add.length - 1; i >= 0; i--) {
        addCellMesh(add[i])
      };

      var remove = _.difference(old_active, new_active);
      for (var i = remove.length - 1; i >= 0; i--) {
        removeCellMesh(remove[i]);
      };

      Camera.render();
    },true);


    $rootScope.$watch('visible', function(new_active, old_active) {

      if (new_active == old_active) { //Happens on first call
        old_active == [];  
      }

      var add = _.difference(new_active, old_active);
      for (var i = add.length - 1; i >= 0; i--) {
        setCellOpacity(add[i], 1.0);
      };

      var remove = _.difference(old_active, new_active);
      for (var i = remove.length - 1; i >= 0; i--) {
        setCellOpacity(remove[i], 0.1);
      };

      Camera.render();
    },true);

  }
  watch();

  
}]);

})(app);

