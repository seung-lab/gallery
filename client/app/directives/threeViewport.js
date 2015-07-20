'use strict';
// Creates the directive (reusable chunk of html and javascript) for three.js.
// Note that right now the SceneService and CameraService are injected into the directive.  These
// services are used to manipulate the scene else where.
// Currently the Renderer and controls are part of the directive but could just as easily be 
// moved into their own services if functionality they provide need to be manipulated by a UI control.
(function(app) { 


  app.directive('threeViewport', ['Camera3DService',   
  function (Camera) {

    return {
      restrict: "AE",

      link: function (scope, element, attribute) {



        // create the renderer
        var renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor( '#252525', 1.0 );
        Camera.initController(renderer);
        onResize();


        // add renderer to DOM
        element[0].appendChild(renderer.domElement);

        // handles resizing the renderer when the window is resized
        window.addEventListener('resize', onResize);

        scope.$on('fullscreen', function(){
          onResize();
        });
  
      function onResize() {
        var width = element[0].offsetWidth;
        var height = element[0].offsetHeight;

        renderer.setSize( width , height );
        Camera.setAspectRatio( width  / height ) ;
      }
    }
  }
}
])

})(app);