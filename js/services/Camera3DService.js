// Returns a single instance of a camera.  Consumed by directive and controls.
app.service('Camera3DService', function () {
    // default values for camera
    var viewAngle = 45;
    var aspectRatio = window.innerWidth / window.innerHeight;
    var near = 0.1
    var far = 150000;

    return { perspectiveCam:  new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far)}
});
