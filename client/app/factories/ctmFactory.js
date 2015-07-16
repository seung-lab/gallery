(function (app, THREE){

app.factory("ctmFactory", [function () {

  var ctm = function ( url , callback) {

    this.callback = callback;

    var worker = new Worker( "bower_components/js-openctm/src/CTMWorker.js" );

    var scope = this;
    worker.onmessage = function( event ) {

      var file = event.data;
      
      var geometry = new Model(file);

      callback(geometry);

    };

    worker.postMessage( { "url": url} );

  }
  ctm.prototype.constructor = ctm;
    
  var Model = function ( file ) {

    this.initializeBuffers(file);

    this.reorderVertices();
    
    this.computeDrawCalls();

    this.addAttributes();
  
    return this.geometry;
  };

  Model.prototype.initializeBuffers = function(file) {
    
    this.geometry =  new THREE.BufferGeometry(file);

    // init GL buffers

    this.vertexIndexArray = file.body.indices;
    this.vertexPositionArray = file.body.vertices;
    this.vertexNormalArray = file.body.normals;


    if ( file.body.uvMaps !== undefined && file.body.uvMaps.length > 0 ) {

      this.vertexUvArray = file.body.uvMaps[ 0 ].uv;

    }

    if ( file.body.attrMaps !== undefined && file.body.attrMaps.length > 0 && file.body.attrMaps[ 0 ].name === "Color" ) {

      this.vertexColorArray = file.body.attrMaps[ 0 ].attr;

    }

  };

  Model.prototype.reorderVertices = function() {
    // reorder vertices
    // (needed for buffer splitting, to keep together face vertices)
  
    var newFaces = new Uint32Array( this.vertexIndexArray.length );
    var newVertices = new Float32Array( this.vertexPositionArray.length );

    var newNormals, newUvs, newColors;

    if ( this.vertexNormalArray ) newNormals = new Float32Array( this.vertexNormalArray.length );
    if ( this.vertexUvArray ) newUvs = new Float32Array( this.vertexUvArray.length );
    if ( this.vertexColorArray ) newColors = new Float32Array( this.vertexColorArray.length );

    var indexMap = {}, vertexCounter = 0;

    var scope = this;
    function handleVertex( v ) {

      if ( indexMap[ v ] === undefined ) {

        indexMap[ v ] = vertexCounter;

        var sx = v * 3,
          sy = v * 3 + 1,
          sz = v * 3 + 2,

          dx = vertexCounter * 3,
          dy = vertexCounter * 3 + 1,
          dz = vertexCounter * 3 + 2;

        newVertices[ dx ] = scope.vertexPositionArray[ sx ];
        newVertices[ dy ] = scope.vertexPositionArray[ sy ];
        newVertices[ dz ] = scope.vertexPositionArray[ sz ];

        if ( scope.vertexNormalArray ) {

          newNormals[ dx ] = scope.vertexNormalArray[ sx ];
          newNormals[ dy ] = scope.vertexNormalArray[ sy ];
          newNormals[ dz ] = scope.vertexNormalArray[ sz ];

        }

        if ( scope.vertexUvArray ) {

          newUvs[ vertexCounter * 2 ]   = this.vertexUvArray[ v * 2 ];
          newUvs[ vertexCounter * 2 + 1 ] = this.vertexUvArray[ v * 2 + 1 ];

        }

        if ( scope.vertexColorArray ) {

          newColors[ vertexCounter * 4 ]     = scope.vertexColorArray[ v * 4 ];
          newColors[ vertexCounter * 4 + 1 ] = scope.vertexColorArray[ v * 4 + 1 ];
          newColors[ vertexCounter * 4 + 2 ] = scope.vertexColorArray[ v * 4 + 2 ];
          newColors[ vertexCounter * 4 + 3 ] = scope.vertexColorArray[ v * 4 + 3 ];

        }

        vertexCounter += 1;

      }

    }

    var a, b, c;

    for ( var i = 0; i < this.vertexIndexArray.length; i += 3 ) {

      a = this.vertexIndexArray[ i ];
      b = this.vertexIndexArray[ i + 1 ];
      c = this.vertexIndexArray[ i + 2 ];

      handleVertex( a );
      handleVertex( b );
      handleVertex( c );

      newFaces[ i ]     = indexMap[ a ];
      newFaces[ i + 1 ] = indexMap[ b ];
      newFaces[ i + 2 ] = indexMap[ c ];

    }

    this.vertexIndexArray = newFaces;
    this.vertexPositionArray = newVertices;

    if ( this.vertexNormalArray ) this.vertexNormalArray = newNormals;
    if ( this.vertexUvArray ) this.vertexUvArray = newUvs;
    if ( this.vertexColorArray ) this.vertexColorArray = newColors;

  };

  Model.prototype.computeDrawCalls = function() {

    var indices = this.vertexIndexArray;

    var start = 0,
      min = this.vertexPositionArray.length,
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

        this.geometry.addDrawCall(start, i - start, minPrev );

        start = i;
        min = this.vertexPositionArray.length;
        max = 0;

      }

      minPrev = min;

    }

    for ( var k = start; k < i; ++ k ) {

      indices[ k ] -= minPrev;

    }

    this.geometry.addDrawCall( start, i - start, minPrev );

  };

  Model.prototype.addAttributes = function() {
      
    this.geometry.addAttribute( 'index' , new THREE.BufferAttribute(this.vertexIndexArray, 1));
    this.geometry.addAttribute( 'position', new THREE.BufferAttribute( this.vertexPositionArray , 3));

    if ( this.vertexNormalArray !== undefined ) {
      this.geometry.addAttribute( 'normal' , new THREE.BufferAttribute(this.vertexNormalArray, 3));
    } 
    else {
      this.geometry.computeVertexNormals();
    }

    if ( this.vertexUvArray !== undefined ) {
      this.geometry.addAttribute( 'uv' , new THREE.BufferAttribute(this.vertexUvArray, 2));
    }

    if ( this.vertexColorArray !== undefined ) {
      this.geometry.addAttribute( 'color' , new THREE.BufferAttribute(this.vertexColorArray, 4));
    }
  };

  return ctm;

}]);

})(app, THREE);