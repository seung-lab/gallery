'use strict';

(function (app, THREE){

app.factory('scene', function () {
    var scene = new THREE.Scene();
    //scene.fog = new THREE.Fog( 0x808080, 3000, 6000 );
    // LIGHTS
    var ambientLight = new THREE.AmbientLight( 0x444444 );
    var light = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light.position.set( 2, 4, 5 );
    
    var light2 = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light2.position.set( -4, 2, -3 );

    scene.add(ambientLight);
    scene.add(light);
    scene.add(light2);

    return scene;
});

})(app, THREE);