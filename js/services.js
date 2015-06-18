'use strict';
//THREEJS
app.service('SceneService3D', function () {
    var scene = new THREE.Scene();
    //scene.fog = new THREE.Fog( 0x808080, 3000, 6000 );
    // LIGHTS
    var ambientLight = new THREE.AmbientLight( 0x222222 );
    var light = new THREE.DirectionalLight( 0xffffff, 1.0 );
    light.position.set( 2, 4, 5 );
    
    var light2 = new THREE.DirectionalLight( 0xffffff, 1.0 );
    light2.position.set( -4, 2, -3 );

    scene.add(ambientLight);
    scene.add(light);
    scene.add(light2);

    return {
        scene: scene
    }
});

app.service('CoordinatesService3D', ['SceneService3D' , function(SceneService){

    var scene = SceneService.scene;

    this.grid = {};
    this.drawGrid = function(params) {
            params = params || {};
            var size = params.size !== undefined ? params.size:100;
            var scale = params.scale !== undefined ? params.scale:0.1;
            var orientation = params.orientation !== undefined ? params.orientation:"x";
            var grid = new THREE.Mesh(
                new THREE.PlaneGeometry(size, size, size * scale, size * scale),
                new THREE.MeshBasicMaterial({ color: 0x555555, wireframe: true }) 
                );
            // Yes, these are poorly labeled! It would be a mess to fix.
            // What's really going on here:
            // "x" means "rotate 90 degrees around x", etc.
            // So "x" really means "show a grid with a normal of Y"
            //    "y" means "show a grid with a normal of X"
            //    "z" means (logically enough) "show a grid with a normal of Z"
            if (orientation === "x") {
                grid.rotation.x = - Math.PI / 2;
                grid.position.x = size/2;
                grid.position.z = size/2;
            } else if (orientation === "y") {
                grid.rotation.y = - Math.PI / 2;
                grid.position.y = size/2;
                grid.position.z = size/2;
            } else if (orientation === "z") {
                grid.rotation.z = - Math.PI / 2;
                grid.position.x = size/2;
                grid.position.y = size/2;
            }

            scene.add(grid);
            this.grid[orientation] = grid;
    };
    this.drawGround = function(params) {
            params = params || {};
            var size = params.size !== undefined ? params.size:100;
            var color = params.color !== undefined ? params.color:0xFFFFFF;
            var ground = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(size, size),
                // When we use a ground plane we use directional lights, so illuminating
                // just the corners is sufficient.
                // Use MeshPhongMaterial if you want to capture per-pixel lighting:
                // new THREE.MeshPhongMaterial({ color: color, specular: 0x000000,
                new THREE.MeshLambertMaterial({ color: color,
                    // polygonOffset moves the plane back from the eye a bit, so that the lines on top of
                    // the grid do not have z-fighting with the grid:
                    // Factor == 1 moves it back relative to the slope (more on-edge means move back farther)
                    // Units == 4 is a fixed amount to move back, and 4 is usually a good value
                    polygonOffset: true, polygonOffsetFactor: 1.0, polygonOffsetUnits: 4.0
                }));
            ground.rotation.x = - Math.PI / 2;
            ground.position.x = size/2;
            ground.position.z = size/2;
            scene.add(ground);

            this.ground = ground;
    };

    this.drawAllAxes = function(params) {
            params = params || {};
            var axisRadius = params.axisRadius !== undefined ? params.axisRadius:0.04;
            var axisLength = params.axisLength !== undefined ? params.axisLength:11;
            var axisTess = params.axisTess !== undefined ? params.axisTess:48;

            var axisXMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
            var axisYMaterial = new THREE.MeshLambertMaterial({ color: 0x00FF00 });
            var axisZMaterial = new THREE.MeshLambertMaterial({ color: 0x0000FF });
            axisXMaterial.side = THREE.DoubleSide;
            axisYMaterial.side = THREE.DoubleSide;
            axisZMaterial.side = THREE.DoubleSide;
            var axisX = new THREE.Mesh(
                new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true), 
                axisXMaterial
                );
            var axisY = new THREE.Mesh(
                new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true), 
                axisYMaterial
                );
            var axisZ = new THREE.Mesh(
                new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true), 
                axisZMaterial
                );
            axisX.rotation.z = - Math.PI / 2;
            axisX.position.x = axisLength/2-1;

            axisY.position.y = axisLength/2-1;
            
            axisZ.rotation.y = - Math.PI / 2;
            axisZ.rotation.z = - Math.PI / 2;
            axisZ.position.z = axisLength/2-1;

            scene.add( axisX );
            scene.add( axisY );
            scene.add( axisZ );

            var arrowX = new THREE.Mesh(
                new THREE.CylinderGeometry(0, 4*axisRadius, 4*axisRadius, axisTess, 1, true), 
                axisXMaterial
                );
            var arrowY = new THREE.Mesh(
                new THREE.CylinderGeometry(0, 4*axisRadius, 4*axisRadius, axisTess, 1, true), 
                axisYMaterial
                );
            var arrowZ = new THREE.Mesh(
                new THREE.CylinderGeometry(0, 4*axisRadius, 4*axisRadius, axisTess, 1, true), 
                axisZMaterial
                );
            arrowX.rotation.z = - Math.PI / 2;
            arrowX.position.x = axisLength - 1 + axisRadius*4/2;

            arrowY.position.y = axisLength - 1 + axisRadius*4/2;

            arrowZ.rotation.z = - Math.PI / 2;
            arrowZ.rotation.y = - Math.PI / 2;
            arrowZ.position.z = axisLength - 1 + axisRadius*4/2;

            scene.add( arrowX );
            scene.add( arrowY );
            scene.add( arrowZ );

            this.axes = [ axisX , axisY, axisZ , arrowX , arrowY , arrowZ];
    };

    this.removeGround = function () {
        scene.remove(this.ground);
    };

    this.removeAxes = function () {
        this.axes.forEach(function(object){
            scene.remove(object);
        });
    };

    this.removeGrid = function (orientation) {
        scene.remove(this.grid[orientation]);
    };
}]);

// Returns a single instance of a camera.  Consumed by directive and controls.
app.service('CameraService3D', function () {
    // default values for camera
    var viewAngle = 45;
    var aspectRatio = window.innerWidth / window.innerHeight;
    var near = 0.1
    var far = 150000;

    return { perspectiveCam:  new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far)}
});

// Adds a new model to the viewer with the provided x, y offset from the UI.  This specific model
// creates a tube that follows a collection of 3d points.
app.service('CellService', ['SceneService3D', 'OctLODFactory', function (SceneService, OctLOD) {

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

app.service("util", ["$window",
  function($window) {
      var util = this;
      var setTimeout = $window.setTimeout,
      clearTimeout = $window.clearTimeout;
      util.toArray = function(a) {
          return a.forEach ? a : [a]
      };
      util.list = function(a, b) {
          var length = a.length;

          util.toArray(b).forEach(function(b) {
              a.push(b);
          });
          return a.length - length
      };
      util.unlist = function(a, b) {
          var c = a.indexOf(b);
          return~ c && a.splice(c, 1), a.length
      };
      util.move = function(a, b, c) {
          return a.splice(c, 0, a.splice(b, 1)[0]), a
      };
      util.pad = function(a, b) {
          return Array(a + 1).join(b || " ")
      };
      util.buildUrl = function(url, params) {
          if (!params) return url;
          var f = [];
          angular.forEach(params, function(c, e) { 
              c = util.toJson(c);
              f.push(encodeURIComponent(e) + "=" + encodeURIComponent(c));
          })
          return url + (-1 == url.indexOf("?") ? "?" : "&") + f.join("&")
      };
      util.element = function(b) {
          return angular.isString(b) && (b = $window.document.getElementById(b)), angular.element(b)
      };
      util.randomHex = function(a) {
          for (var b = ""; a > 0;) b += Math.floor(Math.random() * Math.pow(10, 16)).toString(16).substr(0, 8 > a ? a : 8), a -= 8;
              return b
      };
      util.generateId = function() {
          return Math.floor(Date.now() / 1e3).toString(16) + util.randomHex(16)
      };
      util.throttle = function(a, b) {
          var c = null;
          return function() {
              clearTimeout(c), c = setTimeout(function() {
                  a.apply(this, arguments), c = null
              }, b)
          }
      };
      util.keys = Object.keys;
      util.toJson = $window.JSON.stringify;
      ["copy", "extend", "forEach", "identity", "fromJson", "isObject", "isString", "isArray", "lowercase", "noop"].forEach(function(b) {
          util[b] = angular[b]
      });
  }
]);


//Two Dimensional view services
app.service('TileService', ['$http', function($http) {

  var plane = new THREE.PlaneBufferGeometry(128, 128, 1, 1);
  var empty = {
    channel: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAIAAABMXPacAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAATpJREFUeNrs18ENgCAQAEE09iJl0H8F2o0N+DTZh7NPcr/JEdjWWuOtc87X8/u6zH84vw+lAQAAQAAACMA/O7zH23kb4AoCIAAABACAin+A93g7bwNcQQAEAIAAAFDxD/Aeb+dtgCsIgAAAEAAAKv4B3uPtvA1wBQEQAAACAEDFP8B7vJ23Aa4gAAIAQAAAqPgHeI+38zbAFQRAAAAIAAAV/wDv8XbeBriCAAgAAAEAoOIf4D3eztsAVxAAAQAgAABU/AO8x9t5G+AKAiAAAAQAgIp/gPd4O28DXEEABACAAABQ8Q/wHm/nbYArCIAAABAAACr+Ad7j7bwNcAUBEAAAAgBAxT/Ae7ydtwGuIAACAEAAAKj4B3iPt/M2wBUEQAAACAAAFf8A7/F23ga4ggAIAAABAKCgR4ABAIa/f2QspBp6AAAAAElFTkSuQmCC",
    segmentation: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC"
  };

  //volumes contains the metada for each volume, and the images for channel and/or segmentation.
  var volumes = {};

  //Tile contains all the meshes for a plane , data is get from volumes and apply as a texture to the tiles.
  var tiles = {};
  window.tiles = tiles;

  var visibleChunks;
  var zpos;

  this.viewportChanged = function( center, viewSize , scene ){
    //This maps from global coordinates to chunk coordinates
    // 224 is the size of each chunk (256 - 32) where 32 is the overlapping between cubes
    // 18 , 50 and - 14 are the offsets for each axis 
    var chunk_coord = { xmin:Math.floor(((center.x - viewSize.x/2 - 32) - 18)/224.0 - 1),
                  ymin:Math.floor(((Math.abs(center.y) - viewSize.y/2 - 32) - 50)/224.0 - 1),
                  zmin:Math.floor((center.z + 14)/224 - 1),
                  xmax:Math.ceil(((center.x + viewSize.x/2 + 32) - 18)/224 - 1),
                  ymax:Math.ceil(((Math.abs(center.y) + viewSize.y/2 + 32) - 50)/224 - 1),
                  zmax:Math.ceil((center.z + 14)/224 - 1)
                }

    // Load new visible chunks and maybe some soon to be visible ones
    if ( JSON.stringify(chunk_coord) !=  JSON.stringify(visibleChunks)) {
      visibleChunks = chunk_coord;

      for ( var x = chunk_coord.xmin; x < chunk_coord.xmax ; ++x) 
        for ( var y = chunk_coord.ymin; y < chunk_coord.ymax; ++y) 
          for ( var z = chunk_coord.zmin ; z < chunk_coord.zmax; ++z) { 
            this.initializeChunk({ x:x, y:y, z:z }, scene);
            updateTexture({x:x, y:y, z:z});
          }
    }

    //update textures
    var z_chunk = (center.z + 14)/224 - 1; 
    var new_zpos = Math.round((z_chunk - chunk_coord.zmin) * 224);
    if ( zpos != new_zpos ) {
      zpos = new_zpos;
      for ( var x = chunk_coord.xmin; x < chunk_coord.xmax ; ++x) 
        for ( var y = chunk_coord.ymin; y < chunk_coord.ymax; ++y) 
          for ( var z = chunk_coord.zmin ; z < chunk_coord.zmax; ++z) 
            updateTexture({x:x, y:y, z:z});
    }
  };

  this.initializeChunk = function (task_coord, scene) {
    var str_coord = JSON.stringify(task_coord);
    if (!(str_coord in volumes)) {
      volumes[str_coord] = {};
      
      var color = '#'+Math.floor(Math.random()*167772).toString(16);

      for ( var x = 0; x < 2; ++x ) {
        for ( var y = 0; y < 2; ++y) {

          var chunk_coord = JSON.stringify({ x_task: task_coord.x, y_task: task_coord.y, x_chunk: x , y_chunk: y});

          tiles[chunk_coord] = {};
          tiles[chunk_coord].texture = new THREE.ImageUtils.loadTexture(empty.channel);
          tiles[chunk_coord].material = new THREE.MeshBasicMaterial({ map:tiles[chunk_coord].texture});
          tiles[chunk_coord].mesh = new THREE.Mesh(plane , tiles[chunk_coord].material );

          tiles[chunk_coord].mesh.position.x =  (task_coord.x + 1) * 224 + 18 + 128 / 2 + 128 * x;
          tiles[chunk_coord].mesh.position.y =  -1 * ((task_coord.y + 1) * 224 + 50 + 128 / 2 + 128 * y);

          scene.add(tiles[chunk_coord].mesh);
        }
      }       

      this.volume(task_coord, function(metadata) {
        volumes[str_coord].metadata = metadata;
        getChannel(task_coord, metadata.channel.id );
      });
    }
  }

  var getChannel = function ( task_coord , channel_id ) {
    var str_coord = JSON.stringify(task_coord);
    volumes[str_coord].channel = {};

    for ( var x = 0; x < 2; ++x ) {
      for ( var y = 0; y < 2; ++y) { 
        for ( var z = 0; z < 2; ++z) {
          
          (function (x, y, z ) {
            var req = {
              responseType: 'json',
              method: 'GET',
              url: 'http://data.eyewire.org/volume/'+channel_id+'/chunk/0/'+x+'/'+y+'/'+z+'/tile/xy/0:128',
            };

            var chann_coord = JSON.stringify({x:x, y:y, z:z});

            $http(req).
            success(function(data, status, headers, config) {
              volumes[str_coord].channel[chann_coord] = data;
              updateTexture(task_coord);
            }).
            error(function(data, status, headers, config) {
              console.error(headers);
            });

          })(x,y,z);
        }
      }
    }
  };

    var updateTexture = function(task_coord) {

      var str_coord = JSON.stringify(task_coord);
      var z = zpos < 128  ? 0 : 1;

      for ( var x_chunk = 0; x_chunk < 2; ++x_chunk ) {
        for ( var y_chunk = 0; y_chunk < 2; ++y_chunk) {
          var chann_coord = JSON.stringify({x:x_chunk, y:y_chunk, z:z});
          var src;
          try {
              src = volumes[str_coord].channel[chann_coord][zpos - 128 * z].data;
          } catch (e) {
              src = empty.channel;
          }
          var image = new Image();
          image.src = src;

          var chunk_coord = JSON.stringify({ x_task: task_coord.x, y_task: task_coord.y, x_chunk: x_chunk , y_chunk: y_chunk});
          tiles[chunk_coord].texture.image = image;
          tiles[chunk_coord].texture.needsUpdate = true;
        }
      }
    } 


    this.volume = function( coord , callback){
      var url = 'https://eyewire.org/2.0/volumes/atcoord/'+coord.x+'/'+coord.y+'/'+coord.z;
      $http.get(url).
      success(function(data, status, headers, config) {
        callback(data);
     }).
      error(function(data, status, headers, config) {
        console.error(headers);
      });
    }
}]);

app.service('TwoDCameraController', ['TileService' , function (TileService) {
  
  var STATES = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2 };
  // 65 /*A*/, 83 /*S*/, 68 /*D*/
  var keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40, ROTATE: 65, ZOOM: 83, PAN: 68 };


  var zoomStart = new THREE.Vector2();
  var zoomEnd = new THREE.Vector2();
  var zoomDelta = new THREE.Vector2();
  var _state = STATES.NONE;
  var _scene;
  var _camera;
  var _viewPort;
  
  this.createControls = function ( camera , domElement, scene , viewPort) {
    _camera = camera;
    _scene = scene;
    _viewPort = viewPort;

    domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
    domElement.addEventListener( 'mousedown', onMouseDown, false );
    domElement.addEventListener( 'mousewheel', onMouseWheel, false );
    window.addEventListener( 'keydown', onKeyDown, false );
    window.addEventListener( 'keyup', onKeyUp, false );

    TileService.viewportChanged(_camera.position, _viewPort , _scene);
  };

  var pan = function ( distance ) {
    _camera.position.add( distance );
    var x = Math.round(_camera.position.x / 128);
    var y = Math.round(_camera.position.y / 128);
  };

  var onMouseDown = function( event ) {

    switch ( _state ){
      case STATES.NONE:
        if ( event.button === 1 ){
          _state = STATES.ZOOM;
        }
        else if ( event.button === 2 ){
          _state = STATES.PAN;
        }
        break;
      case STATES.ZOOM:
        zoomStart.set( event.clientX, event.clientY );
        break;
    }
    
    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'mouseup', onMouseUp, false );
  };

  var onMouseMove = function( event ) {

    if ( _state === STATES.ZOOM ) {
      zoomEnd.set( event.clientX, event.clientY );
      zoomDelta.subVectors( zoomEnd, zoomStart );
      zoomDelta > 0 ? camera.position.z += 1 : camera.position.z -= 1;
      zoomStart.copy( zoomEnd );

    } else if ( _state === STATES.PAN ) {
      var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
      pan( new THREE.Vector3( - movementX, movementY, 0 ) );
    }

    TileService.viewportChanged(_camera.position, _viewPort , _scene);
  };

  var onMouseUp = function( event ) {

    document.removeEventListener( 'mousemove', onMouseMove, false );
    document.removeEventListener( 'mouseup', onMouseUp, false );

    _state = STATES.NONE;
  };

  var onMouseWheel = function( event ) {
    //TileService.moveZ(zpos);
    var delta = 0;

    if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9
      delta = event.wheelDelta;
    } else if ( event.detail ) { // Firefox
      delta = - event.detail;
    }

    delta > 0 ? camera.position.z += 1 : camera.position.z -= 1;
    
    TileService.viewportChanged(_camera.position, _viewPort, _scene);
  };

  var onKeyDown = function( event ) {
    switch ( event.keyCode ) {
      case keys.ZOOM:
        _state = STATES.ZOOM;
        break;
      case keys.PAN:
        _state = STATES.PAN;
        break;
    }
  };
      
  var onKeyUp = function( event ) {
    switch ( event.keyCode ) {
      case keys.ZOOM:
      case keys.PAN:
        _state = STATES.NONE;
      break;
    }
  }; 

  this.prototype = Object.create( THREE.EventDispatcher.prototype );
}]);