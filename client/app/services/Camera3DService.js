'use strict';

( function(app, THREE) {
// Returns a single instance of a camera.  Consumed by directive and controls.
app.service('Camera3DService', ['Scene3DService',function (Scene) {
    // default values for camera
    var viewAngle = 45;
    var aspectRatio = window.innerWidth / window.innerHeight;
    var near = 0.1;
    var far = 1500000;

    var controls;
    var clock = new THREE.Clock();

    var perspectiveCam = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
    var _renderer;

    // perspectiveCam.position.set(1000, 20000, 1500);
    Scene.get().add(perspectiveCam);


    var get = function () {

    	return perspectiveCam;
    };

    var setAspectRatio = function( ratio ) {
    	aspectRatio = ratio;
    	get().aspect = ratio;
      get().updateProjectionMatrix();
        // controls.handleResize();
    };

    var animate = function() {
      requestAnimationFrame(animate);
      controls.update();
    };

    var render = function() {
      _renderer.render(Scene.get(), get());
    };


    var initController = function( renderer ) {

  		_renderer = renderer;
      controls = new THREE.TrackballControls(get());
			controls.addEventListener( 'change', render );

      animate();
    };

    var lookAt = function( position ) {

    	controls.position0.set( position.x , 0, 0);
    	controls.target0 = position;
    	controls.up0.set( -1 , 0, 0 );
    	controls.reset();

    };

    return { 
    	get:get,
    	setAspectRatio:setAspectRatio,
    	initController:initController,
    	lookAt:lookAt 
    };
}]);

})(app, THREE);