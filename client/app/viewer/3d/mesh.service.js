'use strict';
// Adds a new model to the viewer with the provided x, y offset from the UI.  This specific model
// creates a tube that follows a collection of 3d points.
( function (app) { 

app.service('mesh', function (scene, camera, cells, $cacheFactory ) {


  var cache = $cacheFactory('meshes',{capacity: 50});

  function get ( cell_id ) {

    var cell = cache.get( cell_id );
    if ( cell !== undefined ) {
      return cell
    }

    cells.show(cell_id, function(cell) {

      createCell(cell, function(cell) {
        cache.put(cell_id, cell);
        return cell;
      });
    });


  }

  function createCell ( cell , callback) {

    var url = '/api/mesh/'+cell.segment;

    var ctm = new THREE.CTMLoader(false);
    ctm.load( url , function(geometry) { 

      cell.material =  new THREE.MeshLambertMaterial( { color:cell.color , wireframe:false, transparent:true, opacity:1.0 } );
      cell.mesh = new THREE.Mesh( geometry, cell.material );
      cell.mesh.visible = true; 
      scene.add( cell.mesh );

      geometry.computeBoundingBox();
      var position  = new THREE.Vector3().addVectors( geometry.boundingBox.max, geometry.boundingBox.min ).multiplyScalar(0.5);
      camera.lookAt( position );

      callback(cell);

    }, { 'useWorker': true } );

  }

  this.display = function( neurons ) {
    
    for (var i in neurons) {

        var cell_id = neurons[i];

        get(cell_id);
    }
  };


  this.toggleVisibility = function (cell_id) {

    var cell = get(cell_id);

    if (cell.mesh.visible == true) {

      cell.mesh.visible = false;

    }
    else {
      cell.mesh.visible = true;
    }
    camera.render();

  };

  var showBoundingBox = function ( geometry ){

    var bbox = geometry.boundingBox;

    var box_geometry = new THREE.BoxGeometry( bbox.max.x - bbox.min.x , bbox.max.y - bbox.min.y , bbox.max.z - bbox.min.z );
    var material = new THREE.MeshBasicMaterial( {color: 0xffffff, wireframe:true} );
    var cube = new THREE.Mesh( box_geometry, material );
    cube.position.set( (bbox.max.x + bbox.min.x)/2.0 , (bbox.max.y + bbox.min.y)/2.0 * scale, (bbox.max.z + bbox.min.z)/2.0 * scale);
    scene.add( cube );

  };

   this.setOpacity = function (cell_id, opacity ) {


    var cell = get(cell_id);

    if (opacity == 1.0) {

      cell.mesh.material.transparent = false;
    
    }
    else {

      cell.mesh.material.transparent = true;

    }

    cell.mesh.material.opacity = opacity;
    cell.mesh.material.needsUpdate = true;
    camera.render();


  };
  
});

})(app);

