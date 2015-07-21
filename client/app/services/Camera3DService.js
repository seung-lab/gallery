'use strict';

( function(app, THREE) {
// Returns a single instance of a camera.  Consumed by directive and controls.
app.service('Camera3DService', ['Scene3DService',function (Scene) {

    var _this = this;

    this.createPerspective = function () { 

      // default values for camera
      var viewAngle = 45;
      var near = 0.1;
      var far = 1000000;

      this.perspectiveCam = new THREE.PerspectiveCamera(viewAngle, _this.aspectRatio, near, far);
      Scene.get().add(this.perspectiveCam);

    };

    this.createOrthographic = function () {

      var viewSize = 200000;
      var left = _this.aspectRatio * viewSize/ -2;// Camera frustum left plane.
      var right = _this.aspectRatio * viewSize / 2;// Camera frustum right plane.
      var top  = viewSize / 2; // Camera frustum top plane.
      var bottom = viewSize / -2;// Camera frustum bottom plane.
      var near = 0.1// Camera frustum near plane.
      var far = 1000000;// Camera frustum far plane.

      this.orthographicCam = new THREE.OrthographicCamera( left, right, top, bottom, near, far );

      Scene.get().add(this.orthographicCam);

    };

    this.setCurrentCamera = function(perspective) {
      _this.usePerspective = perspective;

      if (_this.usePerspective) {
        _this.controls.object = _this.perspectiveCam;

      }
      else {
        _this.controls.object = _this.orthographicCam;
      }

      //Update the view size for the new camera.
      //This in need because there might have been a resize while using the other camera.
      _this.setViewSize( _this.width,_this.height);

      _this.controls.reset();
    };

    this.get = function () {

      if (_this.usePerspective) {
        return _this.perspectiveCam;
      }

    	return _this.orthographicCam;
    };

    this.setViewSize = function( width , height ) {
      _this.width = width;
      _this.height = height;


      if ( _this.get() instanceof THREE.OrthographicCamera ) {

        var factor = (width / height ) / _this.aspectRatio;

        _this.get().left *= factor;
        _this.get().right *= factor;

      }

      _this.aspectRatio = width / height;
      _this.get().aspect =  _this.aspectRatio;
      _this.get().updateProjectionMatrix();
      _this.controls.handleResize();
      _this.render();

    };

    this.animate = function() {
      requestAnimationFrame( _this.animate);
      _this.controls.update();
    };

    this.render = function() {
      _this.renderer.render(Scene.get(), _this.get() );
    };


    this.initController = function( renderer ) {
  		_this.renderer = renderer;
      _this.controls = new THREE.TrackballControls( _this.get() );
			_this.controls.addEventListener( 'change', _this.render );

      _this.animate();
    };

    this.lookAt = function( position ) {

    	_this.controls.position0.set( position.x , 0, 0);
    	_this.controls.target0 = position;
    	_this.controls.up0.set( -1 , 0, 0 );
    	_this.controls.reset();

    };

    _this.usePerspective = false;
    _this.aspectRatio = window.innerWidth / window.innerHeight;
    _this.createPerspective();
    _this.createOrthographic();

    window.cam = _this;

    return { 
    	get: this.get,
    	setViewSize:this.setViewSize,
    	initController:this.initController,
    	lookAt:this.lookAt,
      setCurrentCamera:this.setCurrentCamera,
      render: this.render
    };
}]);

})(app, THREE);