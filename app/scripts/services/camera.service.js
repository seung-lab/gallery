'use strict';

// Returns a single instance of a camera.  Consumed by directive and controls.
app.factory('camera', function (scene) {

    var _this = this,
      _needsrender = false;

    _this.events = {
      move: [],
    };

    const PERSPECTIVE = Symbol('perspective');
    const ORTHOGRAPHIC = Symbol('orthographic');

    this.addEventListener = function (evt, fn) {
      _this.events[evt].push(fn);
    };

    this.perspectiveMode = function () { 
      this.camera.fov = 45;
      this.camera.near = 0.1;
      this.camera.far = 1e6;
      this.camera.aspect = _this.aspectRatio;

      this.camera.updateProjectionMatrix();

      this.mode = PERSPECTIVE;

      this.render();
    };

    this.orthographicMode = function () {
      this.camera.fov = 1;
      this.camera.near = 0.1;
      this.camera.far = 1e7;
      this.camera.aspect = _this.aspectRatio;

      this.camera.updateProjectionMatrix();

      this.mode = ORTHOGRAPHIC; 

      this.render();
    };

    this.resetCamera = function () {
      // Update the view size for the new camera.
      // This in need because there might have been a resize while using the other camera.
      _this.setViewSize( _this.width,_this.height);

      _this.controls.reset();
    };

    this.setViewSize = function (width, height) {
      _this.width = width;
      _this.height = height;

      _this.aspectRatio = width / height;
      _this.camera.aspect =  _this.aspectRatio;
      _this.camera.updateProjectionMatrix();
      _this.controls.handleResize();
      _this.render();
    };

    this.render = function() {
      _needsrender = true;
    };

    requestAnimationFrame(function hardRender () {
      _this.controls.update();

      if (_needsrender) {
        _this.renderer.render(scene, _this.camera);  
        _needsrender = false;
      }

      requestAnimationFrame(hardRender);
    });

    this.initController = function(renderer) {
  		_this.renderer = renderer;
      _this.controls = new THREE.TrackballControls(_this.camera, renderer.domElement);
      _this.controls.addEventListener('change', function () {
        _this.render();
      });

      _this.controls.addEventListener('move', function () {
        _this.events.move.forEach(function (fn) {
          fn();
        });
      });
    };

    this.updateControls = function () {
      _this.controls.reset();
      _this.camera.updateProjectionMatrix();
      _this.controls.update();
      _this.render();
    };

    this.lookBBoxFromTop = function (bbox) {

      var size = bbox.size();

      var center = bbox.center();
      center.x += size.x / 2.0;

      var fovrad = _this.camera.fov / 360 * 2 * Math.PI;
      var dist = (Math.max(size.y, size.z) / 2) / Math.tan(fovrad);

      _this.controls.target0 = center;
      _this.controls.position0.set(center.x + 2 * dist, center.y, center.z);

      _this.controls.up0.set(0, 0, -1);

      this.updateControls();
    };

    this.lookBBoxFromSide = function (bbox) {
      
      var size = bbox.size();

      var center = bbox.center();
      center.z += size.z / 2.0;

      var fovrad = _this.camera.fov / 360 * 2 * Math.PI;
      var dist = (Math.max(size.x, size.y) / 2) / Math.tan(fovrad);

      _this.controls.target0 = center;
      _this.controls.position0.set(center.x, center.y, center.z + 2 * dist);

      _this.controls.up0.set(-1, 0, 0);

      this.updateControls();
    };

    _this.aspectRatio = window.innerWidth / window.innerHeight;
    
    this.mode = PERSPECTIVE;

    this.camera = new THREE.PerspectiveCamera();
    this.perspectiveMode();
    scene.add(this.camera);

    return this;
});
