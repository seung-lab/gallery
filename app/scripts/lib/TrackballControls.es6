/**
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin 	/ http://mark-lundin.com
 * @author Simone Manini / http://daron1337.github.io
 * @author Luca Antiga 	/ http://lantiga.github.io
 */

THREE.TrackballControls = function (camera, domElement) {

	var _this = this;
	var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };

	this.camera = camera;
	this.domElement = (domElement !== undefined) ? domElement : document;

	// API

	this.enabled = true;

	this.screen = { 
		left: 0, 
		top: 0, 
		width: 0, 
		height: 0, 
		diagonal: 0,
	};

	this.rotateSpeed = 3.0;
	this.zoomSpeed = 0.02;

	this.noRotate = false;
	this.noZoom = false;
	this.noPan = false;


	// When static moving is false, the panning, and rotation and zooming has some sort of intertia.
	// Which makes the interface look more fluid, the amount of inertia is controlled by dynamicDampingFactor
	this.staticMoving = false;
	this.dynamicDampingFactor = 0.2;
	this.panDynamicDampingFactor = 0.19;

	this.minDistance = 0;
	this.maxDistance = Infinity;

	this.keys = [ 65 /*A*/, 83 /*S*/, 68 /*D*/ ];

	this.scrollFactor = 1.0;

	// internals

	this.target = new THREE.Vector3();

	const EPSILON = 0.000001;

	var lastPosition = new THREE.Vector3();

	var _state = STATE.NONE,
	_prevState = STATE.NONE,

	_eye = new THREE.Vector3(),

	_movePrev = new THREE.Vector2(),
	_moveCurr = new THREE.Vector2(),

	_lastAxis = new THREE.Vector3(),
	_lastAngle = 0,

	_zoomAmt = 0,
	_zoomMin = 4e2,
	_zoomMax = 1e5,

	_touchZoomDistanceStart = 0,
	_touchZoomDistanceEnd = 0,

	_panStart = new THREE.Vector2(),
	_panEnd = new THREE.Vector2();

	// for reset

	this.target0 = this.target.clone();
	this.position0 = this.camera.position.clone();
	this.up0 = this.camera.up.clone();

	// events

	var changeEvent = { type: 'change' };
	var startEvent = { type: 'start' };
	var endEvent = { type: 'end' };
	var moveEvent = { type: 'move' };


	// methods

	this.handleResize = function () {

		if (this.domElement === document) {
			this.screen.left = 0;
			this.screen.top = 0;
			this.screen.width = window.innerWidth;
			this.screen.height = window.innerHeight;
		}
		else {
			var box = this.domElement.getBoundingClientRect();
			// adjustments come from similar code in the jquery offset() function
			var d = this.domElement.ownerDocument.documentElement;
			this.screen.left = box.left + window.pageXOffset - d.clientLeft;
			this.screen.top = box.top + window.pageYOffset - d.clientTop;
			this.screen.width = box.width;
			this.screen.height = box.height;
		}

		this.screen.diagonal = Math.sqrt(this.screen.height * this.screen.height + this.screen.width * this.screen.width);
	};

	this.handleEvent = function (event) {
		if (typeof this[ event.type ] == 'function') {
			this[ event.type ](event);
		}
	};

	var getMouseOnScreen = (function () {

		var vector = new THREE.Vector2();

		return function (pageX, pageY) {

			vector.set(
				(pageX - _this.screen.left) / _this.screen.width,
				(pageY - _this.screen.top) / _this.screen.height
			);

			return vector;

		};

	}());

	var getMouseOnCircle = (function () {

		var vector = new THREE.Vector2();

		return function (pageX, pageY) {

			vector.set(
				((pageX - _this.screen.width * 0.5 - _this.screen.left) / (_this.screen.width * 0.5)),
				((_this.screen.height + 2 * (_this.screen.top - pageY)) / _this.screen.width) // screen.width intentional
			);

			return vector;
		};
	}());

	this.rotateCamera = (function() {

		var axis = new THREE.Vector3(),
			quaternion = new THREE.Quaternion(),
			eyeDirection = new THREE.Vector3(),
			cameraUpDirection = new THREE.Vector3(),
			cameraSidewaysDirection = new THREE.Vector3(),
			moveDirection = new THREE.Vector3(),
			angle;

		return function () {

			moveDirection.set(_moveCurr.x - _movePrev.x, _moveCurr.y - _movePrev.y, 0);
			angle = moveDirection.length();

			if (angle) {

				_eye.copy(_this.camera.position).sub(_this.target);

				eyeDirection.copy(_eye).normalize();
				cameraUpDirection.copy(_this.camera.up).normalize();
				cameraSidewaysDirection.crossVectors(cameraUpDirection, eyeDirection).normalize();

				cameraUpDirection.setLength(_moveCurr.y - _movePrev.y);
				cameraSidewaysDirection.setLength(_moveCurr.x - _movePrev.x);

				moveDirection.copy(cameraUpDirection.add(cameraSidewaysDirection));

				axis.crossVectors(moveDirection, _eye).normalize();

				angle *= _this.rotateSpeed;
				quaternion.setFromAxisAngle(axis, angle);

				_eye.applyQuaternion(quaternion);
				_this.camera.up.applyQuaternion(quaternion);

				_lastAxis.copy(axis);
				_lastAngle = angle;
			}
			else if (!_this.staticMoving && _lastAngle) {
				_lastAngle *= Math.sqrt(1.0 - _this.dynamicDampingFactor);
				_eye.copy(_this.camera.position).sub(_this.target);
				quaternion.setFromAxisAngle(_lastAxis, _lastAngle);
				_eye.applyQuaternion(quaternion);
				_this.camera.up.applyQuaternion(quaternion);
			}

			_movePrev.copy(_moveCurr);

		};
	}());


	this.zoomCamera = function () {
		var scrollFactor;

		if (_state === STATE.TOUCH_ZOOM_PAN) {
			scrollFactor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
			_touchZoomDistanceStart = _touchZoomDistanceEnd;
			_this.zoom(scrollFactor);
			_zoomAmt = 0;
		} 
		else {
			scrollFactor = Math.max(1.0 - _zoomAmt * this.zoomSpeed, 0.01);

			_this.zoom(scrollFactor);

			if (_this.staticMoving) {
				_zoomAmt = 0;
			}
			else {
				_zoomAmt *= this.dynamicDampingFactor;
			}
		}
	};

	this.zoom = function (factor) {	
		var len = _eye.length();
		var newlen = _eye.clone().multiplyScalar(factor).length();

		let fov_rad = this.camera.fov * THREE.Math.DEG2RAD;
		let zoomMax = _zoomMax / Math.tan(fov_rad);

		if (newlen < _zoomMin) {
			factor *= 1.2;
		}
		else if (newlen > zoomMax) {
			factor *= 0.95;
		}

		if ((factor > 0.9 && factor < 1 && len - _zoomMin < 400)
			|| (factor > 1 && factor < 1.05 && len - zoomMax > -(zoomMax * 0.05))) {

			factor = 1
		}

		if (len === 0) {
			_eye.set(0.1, 0.1, 0.1);
		}
		else if (newlen < _zoomMin / 2) {
			_zoomAmt = 0;
		}
		else if (newlen > zoomMax * 5) {
			_zoomAmt = 0;
		}
		else {
			_eye.multiplyScalar(factor);
		}
	}

	this.computeZoomFactor = function () {
		let zoom_level_1 = (this.screen.height / 2) / Math.tan(this.camera.fov * THREE.Math.DEG2RAD / 2);
		let distance_to_target = _this.camera.position.clone().sub(_this.target).length();

		return distance_to_target / zoom_level_1; // e.g. 0.5x, 2x, 10x
	};

	this.screenHeightInWorldCoordinates = function () {
		let distance_to_target = _this.camera.position.clone().sub(_this.target).length();

		let fov_rad = this.camera.fov * THREE.Math.DEG2RAD;
		return 2 * Math.tan(fov_rad / this.camera.aspect / 2) * distance_to_target;
	};

	this.panCamera = (function() {

		var mouseChange = new THREE.Vector2(),
			pan = new THREE.Vector3();

		return function () {
			mouseChange.copy(_panEnd).sub(_panStart);

			if (mouseChange.lengthSq() > EPSILON) {
				_this.panCameraInstantly(mouseChange);

				// If static movement is set to false the camera has some sort of inertia
				if (_this.staticMoving) {
					_panStart.copy(_panEnd);
				} 
				else {
					// This restart this event.
					_panStart.add(mouseChange.subVectors(_panEnd, _panStart).multiplyScalar(this.panDynamicDampingFactor));
				}
			}
		};
	}());

	this.panCameraInstantly = (function () {
		let change = new THREE.Vector2(),
			cameraUp = new THREE.Vector3(),
			pan = new THREE.Vector3();

		return function (displacement) {
			change.copy(displacement);

			if (change.lengthSq() > EPSILON) {
				let screenHeight = _this.screenHeightInWorldCoordinates();

				change.multiplyScalar(screenHeight); 

				pan.copy(_eye).cross(_this.camera.up).setLength(change.x);
				pan.add(cameraUp.copy(_this.camera.up).setLength(change.y));

				// When panning target an camera moves, this means the target doesn't change
				_this.camera.position.add(pan);
				_this.target.add(pan);
			}
		};
	})();

	this.checkDistances = function () {
		if (!_this.noZoom || !_this.noPan) {
			if (_eye.lengthSq() > _this.maxDistance * _this.maxDistance) {
				_this.camera.position.addVectors(_this.target, _eye.setLength(_this.maxDistance));
			}

			if (_eye.lengthSq() < _this.minDistance * _this.minDistance) {
				_this.camera.position.addVectors(_this.target, _eye.setLength(_this.minDistance));
			}
		}
	};

	this.update = function () {

		_eye.subVectors(_this.camera.position, _this.target);

		if (!_this.noRotate) {
			_this.rotateCamera();
		}

		if (!_this.noZoom) {
			_this.zoomCamera();
		}

		if (!_this.noPan) {
			_this.panCamera();
		}

		_this.camera.position.addVectors(_this.target, _eye);

		_this.checkDistances();

		_this.camera.lookAt(_this.target);

		if (lastPosition.distanceToSquared(_this.camera.position) > EPSILON) {

			_this.dispatchEvent(moveEvent);

			_this.dispatchEvent(changeEvent);
			lastPosition.copy(_this.camera.position);
		}
	};

	this.cancelMotion = function () {
		_moveCurr.copy(_movePrev);
		_panStart.copy(_panEnd);
	};

	this.reset = function () {

		_state = STATE.NONE;
		_prevState = STATE.NONE;

		_this.target.copy(_this.target0);
		_this.camera.position.copy(_this.position0);
		_this.camera.up.copy(_this.up0);

		_eye.subVectors(_this.camera.position, _this.target);

		_this.camera.lookAt(_this.target);

		lastPosition.copy(_this.camera.position);

		_this.cancelMotion();

		_this.dispatchEvent(changeEvent);
	};

	// listeners

	function keydown(event) {

		if (_this.enabled === false) return;

		window.removeEventListener('keydown', keydown);

		_prevState = _state;

		if (_state !== STATE.NONE) {

			return;

		} else if (event.keyCode === _this.keys[ STATE.ROTATE ] && !_this.noRotate) {

			_state = STATE.ROTATE;

		} else if (event.keyCode === _this.keys[ STATE.ZOOM ] && !_this.noZoom) {

			_state = STATE.ZOOM;

		} else if (event.keyCode === _this.keys[ STATE.PAN ] && !_this.noPan) {

			_state = STATE.PAN;

		}

	}

	function keyup(event) {

		if (_this.enabled === false) return;

		_state = _prevState;

		window.addEventListener('keydown', keydown, false);

	}

	function mousedown (event) {
		if (_this.enabled === false) { 
			return; 
		}

		event.preventDefault();
		event.stopPropagation();

		if (_state === STATE.NONE) {
			_state = event.button;

			if (event.button === 1) { // middle click
				_state = STATE.PAN;
			}
		}

		_this.cancelMotion();

		if (_state === STATE.ROTATE && !_this.noRotate) {
			_moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
			_movePrev.copy(_moveCurr);
		} 
		else if (_state === STATE.ZOOM && !_this.noZoom) {
		
		} 
		else if (_state === STATE.PAN && !_this.noPan) {
			_panStart.copy(getMouseOnScreen(event.pageX, event.pageY));
			_panEnd.copy(_panStart);
		}

		document.addEventListener('mousemove', mousemove, false);
		document.addEventListener('mouseup', mouseup, false);

		_this.dispatchEvent(startEvent);
	}

	function mousemove(event) {

		if (_this.enabled === false) return;

		event.preventDefault();
		event.stopPropagation();

		if (_state === STATE.ROTATE && !_this.noRotate) {
			_movePrev.copy(_moveCurr);
			_moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
		} 
		else if (_state === STATE.ZOOM && !_this.noZoom) {

		} 
		else if (_state === STATE.PAN && !_this.noPan) {
			_panEnd.copy(getMouseOnScreen(event.pageX, event.pageY));
		}

	}

	function mouseup(event) {

		if (_this.enabled === false) return;

		event.preventDefault();
		event.stopPropagation();

		_state = STATE.NONE;

		document.removeEventListener('mousemove', mousemove);
		document.removeEventListener('mouseup', mouseup);
		_this.dispatchEvent(endEvent);

	}

	function mousewheel (event) {

		if (_this.enabled === false) return;

		event.preventDefault();
		event.stopPropagation();

		let delta = 0;

		if (event.wheelDelta) { // WebKit / Opera / Explorer 9
			delta = event.wheelDelta / 40;
		} 
		else if (event.detail) { // Firefox
			delta = - event.detail / 3;
		}

		// This logic is only partially figured out. That 1/30 number was
		// determined experimentally, but somehow it works for mouse and trackpad.
		let displacement = getMouseOnCircle(event.pageX, event.pageY)
				.multiplyScalar(1 / 30 * delta);

		displacement.x *= -1;

		_this.panCameraInstantly(displacement);

		_zoomAmt += delta;
		_this.dispatchEvent(startEvent);
		_this.dispatchEvent(endEvent);
	}

	function touchstart(event) {

		if (_this.enabled === false) return;

		switch (event.touches.length) {
			case 1:
				_state = STATE.TOUCH_ROTATE;
				_moveCurr.copy(getMouseOnCircle(event.touches[ 0 ].pageX, event.touches[ 0 ].pageY));
				_movePrev.copy(_moveCurr);
				break;

			case 2:
				_state = STATE.TOUCH_ZOOM_PAN;
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt(dx * dx + dy * dy);

				var x = (event.touches[ 0 ].pageX + event.touches[ 1 ].pageX) / 2;
				var y = (event.touches[ 0 ].pageY + event.touches[ 1 ].pageY) / 2;
				_panStart.copy(getMouseOnScreen(x, y));
				_panEnd.copy(_panStart);
				break;

			default:
				_state = STATE.NONE;
		}

		_this.dispatchEvent(startEvent);
	}

	function touchmove(event) {

		if (_this.enabled === false) return;

		event.preventDefault();
		event.stopPropagation();

		switch (event.touches.length) {

			case 1:
				_movePrev.copy(_moveCurr);
				_moveCurr.copy(getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY));
				break;

			case 2:
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);

				var x = (event.touches[ 0 ].pageX + event.touches[ 1 ].pageX) / 2;
				var y = (event.touches[ 0 ].pageY + event.touches[ 1 ].pageY) / 2;
				_panEnd.copy(getMouseOnScreen(x, y));
				break;

			default:
				_state = STATE.NONE;

		}

	}

	function touchend(event) {

		if (_this.enabled === false) return;

		switch (event.touches.length) {

			case 1:
				_movePrev.copy(_moveCurr);
				_moveCurr.copy(getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY));
				break;

			case 2:
				_touchZoomDistanceStart = _touchZoomDistanceEnd = 0;

				var x = (event.touches[ 0 ].pageX + event.touches[ 1 ].pageX) / 2;
				var y = (event.touches[ 0 ].pageY + event.touches[ 1 ].pageY) / 2;
				_panEnd.copy(getMouseOnScreen(x, y));
				_panStart.copy(_panEnd);
				break;

		}

		_state = STATE.NONE;
		_this.dispatchEvent(endEvent);

	}

	this.domElement.addEventListener('contextmenu', function (event) { event.preventDefault(); }, false);

	this.domElement.addEventListener('mousedown', mousedown, false);

	this.domElement.addEventListener('mousewheel', mousewheel, false);
	this.domElement.addEventListener('DOMMouseScroll', mousewheel, false); // firefox

	this.domElement.addEventListener('touchstart', touchstart, false);
	this.domElement.addEventListener('touchend', touchend, false);
	this.domElement.addEventListener('touchmove', touchmove, false);

	window.addEventListener('keydown', keydown, false);
	window.addEventListener('keyup', keyup, false);

	this.handleResize();

	// force an update at start
	this.update();

};

THREE.TrackballControls.prototype = Object.create(THREE.EventDispatcher.prototype);
THREE.TrackballControls.prototype.constructor = THREE.TrackballControls;