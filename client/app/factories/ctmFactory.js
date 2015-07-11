'use strict';

(function (app, THREE){

app.factory("ctmFactory", ['$rootScope','Scene3DService', '$http', 
  function ($rootScope ,SceneService, $http) {

  var ctm = function ( cellID ) {
    this.cell = $rootScope.cells.get(cellID);


    this.loadMesh('api/mesh/'+this.cell.segment);

  }

  ctm.prototype.constructor = ctm;

  ctm.prototype.loadMesh = function (url) {

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.overrideMimeType("text/plain; charset=x-user-defined");
    
    var scope = this;
    xhr.onload = function (e) { 

      if (xhr.readyState === 4) {
      
        if (xhr.status === 200) {

          if (xhr.responseText.length == 0) {
            console.error("returned empty mesh file");
            return;
          }

          var stream = new CTM.Stream(xhr.responseText);
          var file = new CTM.File(stream);

          createModelBuffers( file , function(geometry) {
            var material = new THREE.MeshLambertMaterial( { color:scope.cell.color , wireframe:false } );
            scope.mesh = new THREE.Mesh( geometry, material );
            scope.mesh.scale.set(0.05,0.05,0.05)

            SceneService.scene.add( scope.mesh );
            console.log('finish loading');
          });          
      
        } 
        else {
          console.log('no mesh available');
        }
      
      }

    };


    xhr.send();
 
  


  };

  var createModelBuffers = function ( file, callback ) {

    var Model = function ( ) {

      var scope = this;

      var reorderVertices = true;

      scope.materials = [];

      THREE.BufferGeometry.call( this );

      // init GL buffers

      var vertexIndexArray = file.body.indices,
      vertexPositionArray = file.body.vertices,
      vertexNormalArray = file.body.normals;

      var vertexUvArray, vertexColorArray;

      if ( file.body.uvMaps !== undefined && file.body.uvMaps.length > 0 ) {

        vertexUvArray = file.body.uvMaps[ 0 ].uv;

      }

      if ( file.body.attrMaps !== undefined && file.body.attrMaps.length > 0 && file.body.attrMaps[ 0 ].name === "Color" ) {

        vertexColorArray = file.body.attrMaps[ 0 ].attr;

      }

      // reorder vertices
      // (needed for buffer splitting, to keep together face vertices)

      if ( reorderVertices ) {

        var newFaces = new Uint32Array( vertexIndexArray.length ),
          newVertices = new Float32Array( vertexPositionArray.length );

        var newNormals, newUvs, newColors;

        if ( vertexNormalArray ) newNormals = new Float32Array( vertexNormalArray.length );
        if ( vertexUvArray ) newUvs = new Float32Array( vertexUvArray.length );
        if ( vertexColorArray ) newColors = new Float32Array( vertexColorArray.length );

        var indexMap = {}, vertexCounter = 0;

        function handleVertex( v ) {

          if ( indexMap[ v ] === undefined ) {

            indexMap[ v ] = vertexCounter;

            var sx = v * 3,
              sy = v * 3 + 1,
              sz = v * 3 + 2,

              dx = vertexCounter * 3,
              dy = vertexCounter * 3 + 1,
              dz = vertexCounter * 3 + 2;

            newVertices[ dx ] = vertexPositionArray[ sx ];
            newVertices[ dy ] = vertexPositionArray[ sy ];
            newVertices[ dz ] = vertexPositionArray[ sz ];

            if ( vertexNormalArray ) {

              newNormals[ dx ] = vertexNormalArray[ sx ];
              newNormals[ dy ] = vertexNormalArray[ sy ];
              newNormals[ dz ] = vertexNormalArray[ sz ];

            }

            if ( vertexUvArray ) {

              newUvs[ vertexCounter * 2 ]   = vertexUvArray[ v * 2 ];
              newUvs[ vertexCounter * 2 + 1 ] = vertexUvArray[ v * 2 + 1 ];

            }

            if ( vertexColorArray ) {

              newColors[ vertexCounter * 4 ]     = vertexColorArray[ v * 4 ];
              newColors[ vertexCounter * 4 + 1 ] = vertexColorArray[ v * 4 + 1 ];
              newColors[ vertexCounter * 4 + 2 ] = vertexColorArray[ v * 4 + 2 ];
              newColors[ vertexCounter * 4 + 3 ] = vertexColorArray[ v * 4 + 3 ];

            }

            vertexCounter += 1;

          }

        }

        var a, b, c;

        for ( var i = 0; i < vertexIndexArray.length; i += 3 ) {

          a = vertexIndexArray[ i ];
          b = vertexIndexArray[ i + 1 ];
          c = vertexIndexArray[ i + 2 ];

          handleVertex( a );
          handleVertex( b );
          handleVertex( c );

          newFaces[ i ]     = indexMap[ a ];
          newFaces[ i + 1 ] = indexMap[ b ];
          newFaces[ i + 2 ] = indexMap[ c ];

        }

        vertexIndexArray = newFaces;
        vertexPositionArray = newVertices;

        if ( vertexNormalArray ) vertexNormalArray = newNormals;
        if ( vertexUvArray ) vertexUvArray = newUvs;
        if ( vertexColorArray ) vertexColorArray = newColors;

      }

      // compute offsets

      scope.offsets = [];

      var indices = vertexIndexArray;

      var start = 0,
        min = vertexPositionArray.length,
        max = 0,
        minPrev = min;

      for ( var i = 0; i < indices.length; ) {

        for ( var j = 0; j < 3; ++ j ) {

          var idx = indices[ i ++ ];

          if ( idx < min ) min = idx;
          if ( idx > max ) max = idx;

        }

        if ( max - min > 65535 ) {

          i -= 3;

          for ( var k = start; k < i; ++ k ) {

            indices[ k ] -= minPrev;

          }

          scope.offsets.push( { start: start, count: i - start, index: minPrev } );

          start = i;
          min = vertexPositionArray.length;
          max = 0;

        }

        minPrev = min;

      }

      for ( var k = start; k < i; ++ k ) {

        indices[ k ] -= minPrev;

      }

      scope.offsets.push( { start: start, count: i - start, index: minPrev } );

      // recast CTM 32-bit indices as 16-bit WebGL indices

      var vertexIndexArray16 = new Uint16Array( vertexIndexArray );

      // attributes

      var attributes = scope.attributes;

      attributes[ "index" ]    = { itemSize: 1, array: vertexIndexArray16, numItems: vertexIndexArray16.length };
      attributes[ "position" ] = { itemSize: 3, array: vertexPositionArray, numItems: vertexPositionArray.length };

      if ( vertexNormalArray !== undefined ) {

        attributes[ "normal" ] = { itemSize: 3, array: vertexNormalArray, numItems: vertexNormalArray.length };

      }

      if ( vertexUvArray !== undefined ) {

        attributes[ "uv" ] = { itemSize: 2, array: vertexUvArray, numItems: vertexUvArray.length };

      }

      if ( vertexColorArray !== undefined ) {

        attributes[ "color" ]  = { itemSize: 4, array: vertexColorArray, numItems: vertexColorArray.length };

      }

    }

    Model.prototype = Object.create( THREE.BufferGeometry.prototype );

    var geometry = new Model();

    // compute vertex normals if not present in the CTM model

    if ( geometry.attributes[ "normal" ] === undefined ) {

      geometry.computeVertexNormals();

    }

    callback( geometry );

  };

  ctm.prototype.setVisibility = function(visible){
    if (!this.mesh) {
      return;
    }

    this.mesh.visible = visible;
  }  


  return ctm;

}]);

})(app, THREE);