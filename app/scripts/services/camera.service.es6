'use strict';

// Returns a single instance of a camera.  Consumed by directive and controls.
app.factory('camera', function (scene) {

    var _this = this,
      _needsrender = false;

    _this.events = {
      move: [],
      point: [],
    };

    function broadcast (evt, arg) {
       _this.events[evt].forEach(function (fn) {
          fn(arg);
        });
    }

    const PERSPECTIVE = Symbol('perspective');
    const ORTHOGRAPHIC = Symbol('orthographic');

    this.addEventListener = function (evt, fn) {
      _this.events[evt].push(fn);
    };

    this.perspectiveMode = function () { 
      this.camera.fov = 45;
      this.camera.near = 1.0;
      this.camera.far = 1e7;
      this.camera.aspect = _this.aspectRatio;

      this.camera.updateProjectionMatrix();

      this.mode = PERSPECTIVE;

      this.render();
    };

    this.orthographicMode = function () {
      this.camera.fov = 1;
      this.camera.near = 1.0;
      this.camera.far = 1e8;
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
      if (_this.controls) {
        _this.controls.update();
      }

      TWEEN.update();

      if (_needsrender && _this.renderer) {
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
        broadcast('move', null);
      });

      angular.element(_this.renderer.domElement)
        .stationaryClick(function (evt) {
          let new_target = _this.pickPoint(evt.clientX, evt.clientY);

          if (!new_target) {
            return;
          }

          let position = _this.controls.target.clone();

          let tween = (new TWEEN.Tween(position))
            .to(new_target, 800)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function () {
              _this.setTarget(position);
              _this.render();
            })
            .start();

            broadcast('point', new_target);
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

      var fovrad = _this.camera.fov * THREE.Math.DEG2RAD;
      var dist = (Math.max(size.y, size.z) / 2) / Math.tan(fovrad);

      var center = bbox.center();
      _this.controls.target0 = center.clone();
      center.x += size.x / 2.0;

      var x = -1 * (center.x + 2 * dist);

      _this.controls.position0.set(x, center.y, center.z);

      _this.controls.up0.set(0, 0, -1);

      this.updateControls();
    };

    this.lookBBoxFromSide = function (bbox) {
      
      var size = bbox.size();

      var fovrad = _this.camera.fov * THREE.Math.DEG2RAD;
      var dist = (Math.max(size.x, size.y) / 2) / Math.tan(fovrad);

      var center = bbox.center();
      _this.controls.target0 = center.clone();
      center.z += size.z / 2.0;

      _this.controls.position0.set(center.x, center.y, center.z + 2 * dist);

      _this.controls.up0.set(1, 0, 0);

      this.updateControls();
    };

    this.gotoPoint = function (position) {
      _this.controls.position0.copy(position);
      _this.controls.position0.z -= 1e5;
      _this.controls.target0.copy(position);
      _this.updateControls();
    };

    // x,y,z in world coordinates
    this.setTarget = function (position) {
      _this.controls.target.copy(position);
      _this.camera.updateProjectionMatrix();
      _this.controls.update();
    };

    this.getTarget = function () {
      return _this.controls.target.clone();
    };

    this.pickPoint = function (x, y) {

      x = x / _this.width;
      y = (_this.height - 1 - y) / _this.height;

      x = (x * 2 - 1);
      y = (y * 2 - 1);

      var raycaster = new THREE.Raycaster();
      var mouse = new THREE.Vector2(x, y);

      raycaster.setFromCamera( mouse, _this.camera ); 

      var intersects = raycaster.intersectObjects( scene.children ) || [{ point: new THREE.Vector3() }];

      intersects = intersects.map( (obj) => obj.point );

      intersects.sort(function (a, b) {
        return a.clone().sub(_this.camera.position).length() - b.clone().sub(_this.camera.position).length();
      });

      return intersects[0];
    };

    this.takeScreenshot = function (label, filename) {
      var renderer = createRenderer();
      renderer.antialias = false;

      var weak_gpu = screen.width * screen.height < 800 * 600;

      var width = weak_gpu ? screen.width : 4096;
      var height = (weak_gpu ? screen.height : 4096 / _this.aspectRatio);

      var infoheight = 0.1 * height;

      renderer.setSize(width, height - infoheight);
      
      var camera = _this.camera.clone();
      camera.aspect = renderer.domElement.width / renderer.domElement.height;
      camera.updateProjectionMatrix();

      renderer.render(scene, camera);

      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      var ctx = canvas.getContext('2d');
      ctx.drawImage(renderer.domElement, 0, 0);

      var font_size = Math.max(
        Math.trunc((infoheight * 0.15) * 1000) / 1000,
        12
      );

      ctx.font = font_size + "px Roboto";
      ctx.fillStyle = "#f2f2f2";

      ctx.fillRect(0, canvas.height - infoheight, canvas.width, infoheight);

      var offset = {
        x: screen.width < 500 ? 25 : 175,
        y: infoheight / 2 - font_size,
      };

      ctx.fillStyle = "#1a1a1a";
      ctx.fillText(label.toUpperCase(), offset.x, canvas.height - (offset.y + 1.75 * font_size));
      ctx.fillText('MOUSE RETINAL NEURONS', offset.x, canvas.height - offset.y);

      var loc = location.hostname.toUpperCase();
      var locdim = ctx.measureText(loc);

      ctx.fillText(loc, canvas.width - locdim.width - offset.x, canvas.height - offset.y);

      canvas
        .toBlob(function (blob) {
          saveAs(blob, filename + ".png");
        });

      renderer.dispose();
    };


    // WARNING: Remember to call .dispose when you're done.
    function createRenderer () {
       var renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true,
      });

      renderer.setClearColor(0xff0000, 0);
      renderer.sortObjects = true;
      renderer.clear();

      return renderer;
    }

    _this.aspectRatio = window.innerWidth / window.innerHeight;
    
    this.mode = PERSPECTIVE;

    this.camera = new THREE.PerspectiveCamera();

    var dist = 1e5;

    var keylight = new THREE.PointLight( 0xffffff, 0.6);
    keylight.position.set( -dist, 1.5 * dist, 0 );
    
    var filllight = new THREE.PointLight( 0xffffff, 0.35);
    filllight.position.set( dist, 0, 0 );

    this.camera.add(keylight);
    this.camera.add(filllight);

    this.perspectiveMode();
    scene.add(this.camera);

    return this;
});
