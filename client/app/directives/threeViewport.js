'use strict';
// Creates the directive (reusable chunk of html and javascript) for three.js.
// Note that right now the SceneService and CameraService are injected into the directive.  These
// services are used to manipulate the scene else where.
// Currently the Renderer and controls are part of the directive but could just as easily be 
// moved into their own services if functionality they provide need to be manipulated by a UI control.
(function(app) { 


  app.directive('threeViewport', ['Scene3DService', 'Camera3DService','CellService', 'Coordinates3DService' , 'SettingsFactory', 'SetFactory', 'OctLODFactory', 
  function (SceneService, CameraService, CellService, CoordinatesService, settings, setOperations, OctLOD) {

    function toggleViewBasedOnSettings (scope) {

      scope.$watch('s.toggleGround', function(show) {
        show ? CoordinatesService.drawGround({size:10000}) : CoordinatesService.removeGround();
      });

      scope.$watch('s.toggleAxes', function(show) {
        show ? CoordinatesService.drawAllAxes({axisLength:1000,axisRadius:50,axisTess:50}) : CoordinatesService.removeAxes();
      });

      scope.$watch('s.toggleYZGrid', function(show) {
        show ? CoordinatesService.drawGrid({size:10000,scale:0.001, orientation:"x"}) : CoordinatesService.removeGrid('x');
      });

      scope.$watch('s.toggleXZGrid', function(show) {
        show ? CoordinatesService.drawGrid({size:10000,scale:0.001, orientation:"y"}) : CoordinatesService.removeGrid('y');
      });

      scope.$watch('s.toggleXYGrid', function(show) {
        show ? CoordinatesService.drawGrid({size:10000,scale:0.001, orientation:"z"}) : CoordinatesService.removeGrid('z');
      });

    }
    
    function updateVisibleCells (scope) {
      var activeCells = new Set();
      scope.$watch('r.setId', function(setId){
        if(!setId){
          return;
        }
        var setIndex = scope.sets.getIndex(setId);
        var updatedCells = new Set(scope.sets[setIndex].cells);

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
        if (scope.viewSlide.model == "catalog" && cellId != ""){
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
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor( '#5Caadb', 1.0 );

        //Necesary for the transparent spheres
        renderer.sortObjects = true;


        // set up the controls with the camera and renderer
        controls = new THREE.OrbitControls(CameraService.perspectiveCam, renderer.domElement);
        //controls = new THREE.TrackballControls( camera, renderer.domElement );
        // add renderer to DOM
        element[0].appendChild(renderer.domElement);

        // handles resizing the renderer when the window is resized
        window.addEventListener('resize', onWindowResize, false);  

        toggleViewBasedOnSettings(scope);
        updateVisibleCells (scope);
      
      }

      function animate() {
        requestAnimationFrame(animate);

        controls.update(clock.getDelta() );
        SceneService.scene.updateMatrixWorld();

        CellService.updateCells();
       
        renderer.render(SceneService.scene, CameraService.perspectiveCam);
      }

      function onWindowResize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        CameraService.perspectiveCam.aspect = window.innerWidth / window.innerHeight;
        CameraService.perspectiveCam.updateProjectionMatrix();
      }
    }
  }
}
])

})(app);