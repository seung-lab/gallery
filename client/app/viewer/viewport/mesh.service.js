'use strict';
// Adds a new model to the viewer with the provided x, y offset from the UI.  This specific model
// creates a tube that follows a collection of 3d points.
( function (app) { 

app.service('mesh', function (scene, camera, cells, CacheFactory) {


  var cache = CacheFactory('meshes',{capacity: 50});

  function get ( cell_id ) {

    var cell = cache.get( cell_id.toString() );
    if ( cell !== undefined ) {
      return cell
    }

    cells.show(cell_id, function(cell) {

      createCell(cell, function(cell) {
        cache.put(cell_id.toString() , cell);
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

  //FIXME the for loop will get all the elements ,making the cache not remove the old elements not in use
  this.getVisibleBBox = function() {

    var bbox = new THREE.Box3();

    var keys = cache.keys()

    for (var i in  keys) {

      var cell_id = keys[i];
      var cell = get(cell_id)

      if (cell.mesh.visible) {

        var meshBbox = cell.mesh.geometry.boundingBox;
        bbox.union(meshBbox)
      }
      
    }

    // showBoundingBox( bbox );
    return bbox;
  }


  var showBoundingBox = function ( bbox ){

    var box_geometry = new THREE.BoxGeometry( bbox.max.x - bbox.min.x , bbox.max.y - bbox.min.y , bbox.max.z - bbox.min.z );
    var material = new THREE.MeshBasicMaterial( {color: 0x000, wireframe:true} );
    var cube = new THREE.Mesh( box_geometry, material );

    var scale = 1.0;
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

