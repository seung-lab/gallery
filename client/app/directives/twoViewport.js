'use strict';

(function (app, THREE) {

app.directive('twoViewport', ['TileService','Camera2DController',
  function(TileService, cameraController) {
    var viewSize = 256;
    var scene = new THREE.Scene();

    var canvasWidth = 640;
    var canvasHeight = 640;
    var aspectRatio = canvasWidth / canvasHeight;
    // left, right, top, bottom, near , far
    camera = new THREE.OrthographicCamera(
          -aspectRatio* viewSize/ 2, aspectRatio * viewSize /2,
          viewSize/ 2, - viewSize/2,
          0, 10000
          );

    scene.add(camera);

  return {
      restrict: "AE",

      link: function (scope, element, attribute) {

        
        var renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(canvasHeight, canvasWidth);
        renderer.setClearColor( '#5Caadb', 1.0 );

        element[0].appendChild(renderer.domElement);


        function animate() {
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
        }

        // Set the origin tile
        TileService.volume({x:10, y:10, z:10}, function(volume){
          center = new THREE.Vector3();
          center.x = (volume.channel.xmax + volume.channel.xmin) / 2.0;
          center.y = (volume.channel.ymax + volume.channel.ymin) / 2.0;
          center.z = (volume.channel.zmax + volume.channel.zmin) / 2.0;
          camera.position.set(center.x , -center.y , center.z);
          var controls = cameraController.createControls( camera, renderer.domElement, scene , {x: viewSize, y:viewSize});

           animate();
        });
      }
  };   
}]);
})(app, THREE);