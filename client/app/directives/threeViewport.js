'use strict';
// Creates the directive (reusable chunk of html and javascript) for three.js.
// Note that right now the SceneService and CameraService are injected into the directive.  These
// services are used to manipulate the scene else where.
// Currently the Renderer and controls are part of the directive but could just as easily be 
// moved into their own services if functionality they provide need to be manipulated by a UI control.
(function(app) { 


  app.directive('threeViewport', ['Scene3DService', 'Camera3DService','CellService', 'Coordinates3DService' , 'SettingsFactory', 'SetFactory',  
  function (SceneService, CameraService, CellService, CoordinatesService, settings, setOperations) {

    
    function updateVisibleCells (scope) {
      var activeCells = new Set();
      scope.$watch('r.setId', function(setId){
        if(!setId){
          return;
        }
        var setIndex = scope.sets.getIndex(setId);
        var updatedCells = new Set(scope.sets[setIndex].children);

        var toAdd = setOperations.complement(updatedCells,activeCells);
        toAdd.forEach(function(cellID){
            activeCells.add(cellID);
            CellService.addCell(cellID);
        });
        var toRemove = setOperations.complement(activeCells,updatedCells);
        toRemove.forEach(function(cellID){
            activeCells.delete(cellID);
            CellService.removeCell(cellID);
        });
      });

      scope.$watch("r.cellId", function(cellId){
        if (scope.viewSlide.model == "catalog" && cellId != undefined){
          var updatedCells = new Set([cellId,]);
          var toAdd = setOperations.complement(updatedCells,activeCells);
          toAdd.forEach(function(cellID){
            activeCells.add(cellID);
            CellService.addCell(cellID);
          });
          var toRemove = setOperations.complement(activeCells,updatedCells);
          toRemove.forEach(function(cellID){
            activeCells.delete(cellID);
            CellService.removeCell(cellID);
          });

        }

      });
    }

    return {
      restrict: "AE",

      link: function (scope, element, attribute) {


        var renderer;
        var controls;
        var clock = new THREE.Clock();

        init();
        animate();

      function init() {

        window.scope = scope;
        // Add the camera
        CameraService.perspectiveCam.position.set(1000, 20000, 1500);

        SceneService.scene.add(CameraService.perspectiveCam);

        // create the renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        onResize();

        renderer.setClearColor( '#252525', 1.0 );

   

        // set up the controls with the camera and renderer
        // controls = new THREE.OrbitControls(CameraService.perspectiveCam, renderer.domElement);
        controls = new THREE.OrbitControls(CameraService.perspectiveCam, renderer.domElement );
        // add renderer to DOM
        element[0].appendChild(renderer.domElement);

        // handles resizing the renderer when the window is resized
        window.addEventListener('resize', onResize);
        scope.$watch
        scope.$on('fullscreen', function(){
          onResize();
        });
        

        updateVisibleCells (scope);
      
      }

      function animate() {
        requestAnimationFrame(animate);

        controls.update(clock.getDelta() );
       
        renderer.render(SceneService.scene, CameraService.perspectiveCam);
      }

  
      function onResize() {
        renderer.setSize(element[0].offsetWidth , element[0].offsetHeight);
        CameraService.perspectiveCam.aspect = element[0].offsetWidth  / element[0].offsetHeight;
        CameraService.perspectiveCam.updateProjectionMatrix();
      }
    }
  }
}
])

})(app);