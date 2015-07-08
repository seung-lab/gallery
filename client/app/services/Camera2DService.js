'use strict';

( function (app, THREE) {

app.service('Camera2DService', ['TileService' , function (TileService) {
  
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
      zoomDelta > 0 ? _camera.position.z += 1 : _camera.position.z -= 1;
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

    delta > 0 ? _camera.position.z += 1 : _camera.position.z -= 1;
    
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

})(app, THREE);