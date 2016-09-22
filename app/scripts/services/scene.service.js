'use strict';

(function (app, THREE) {

app.factory('scene', function () {
    var scene = new THREE.Scene();

    // SCENE LIGHTS (fixed w/ respect to scene, not camera)
    var ambientLight = new THREE.AmbientLight( 0x333333 );
    scene.add(ambientLight);

    return scene;
});

})(app, THREE);