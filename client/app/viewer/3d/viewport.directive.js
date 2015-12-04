'use strict';
// Creates the directive (reusable chunk of html and javascript) for three.js.
// Note that right now the SceneService and CameraService are injected into the directive.  These
// services are used to manipulate the scene else where.
// Currently the Renderer and controls are part of the directive but could just as easily be 
// moved into their own services if functionality they provide need to be manipulated by a UI control.
(function(app) { 


  app.directive('viewport', ['camera',  '$timeout', 
  function (Camera, $timeout) {

    return {
      controller : "3DController",
      restrict: "AE",

      link: function (scope, element, attribute) {



        // create the renderer
        var renderer = new THREE.WebGLRenderer({ antialias: true});
        renderer.setClearColor( '#FAFAF0', 1.0 );
        renderer.sortObjects = true;


        // add renderer to DOM
        element[0].appendChild(renderer.domElement);
        renderer.domElement.removeAttribute("style")
        renderer.domElement.removeAttribute("height")
        renderer.domElement.removeAttribute("width")
        renderer.domElement.setAttribute("class", "flex-grow");
        Camera.initController(renderer);
        $timeout( onResize, 0 , false);

        // handles resizing the renderer when the window is resized
        window.addEventListener('resize', function (event){

          onResize();

        });

        scope.$on('resize',function() {
          $timeout( onResize() , 100 , false);

        });

        scope.$watch( element[0].offsetWidth , onResize() );
        scope.$watch( element[0].offsetHeight , onResize() );



  
      function onResize() {
        var width  = element[0].offsetWidth;
        var height = element[0].offsetHeight;

        renderer.setSize( width , height );
        Camera.setViewSize( width , height );

      }
    }
  }
}
])

})(app);