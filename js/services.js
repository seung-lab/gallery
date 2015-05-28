'use strict';

angular.module('threeViewer.services', [])

    // For this example this is consumed by the directive and
    // the model factory.
    .service('SceneService', function () {
        return {
            scene: new THREE.Scene()
        }
    })

    // Returns a single instance of a camera.  Consumed by directive and controls.
    .service('CameraService', function () {
        // default values for camera
        var viewAngle = 45;
        var aspectRatio = window.innerWidth / window.innerHeight;
        var near = 0.1
        var far = 1500000;

        var cam = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
        cam.position.z = 1000;
        cam.position.x = 500;
        cam.position.y = 500;


        return {
            perspectiveCam:  cam}
    })

    .service('MeshDataService', ['$http', function ($http) {
        this.getData = function (cellID, mip , x, y, z) {
            cellID = cellID * 10  + 1;

            return $http({
                method: 'GET',
                url: 'http://data.eyewire.org/cell/'+cellID+'/chunk/'+mip+'/'+x+'/'+y+'/'+z+'/mesh',
                responseType: 'arraybuffer'
            });
        }
    }])

    // Adds a new model to the viewer with the provided x, y offset from the UI.  This specific model
    // creates a tube that follows a collection of 3d points.
    .service('ModelFactory', ['SceneService', 'MeshDataService', function (SceneService, MeshDataService) {
        this.addCell = function (cellID) {
            var mip = 6;
            for ( var x = 0; x < 2 ; x++){
                for ( var y = 0; y < 2; y++){
                    for ( var z=0; z < 2; z++){
                        console.log('chunk x='+x+' y='+y+' z='+z+' position');

                        var mesh = MeshDataService.getData(cellID, mip , x, y , z).then(function (dataResponse) {
                            window.data = dataResponse;
                            console.log(this.chunk);

                            var vertices = new Float32Array(dataResponse.data);
                            if (vertices.length == 0){
                                return
                            }
                                         
                            var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:false } );
                            yield new THREE.Segment( vertices, material );
                            
                        });

                        console.log(mesh);
                        // mesh.position.set(x,y,z).multiplyScalar(128 * Math.pow(2, mip));
                        // mesh.scale.set(0.5, 0.5, 0.5);
                          
                        // // add to the scene
                        // SceneService.scene.add(mesh);
                    }
                }
            }
          
        }
        this.showGrid = function() {
            var geometry = new THREE.PlaneGeometry( 5000, 5000, 500, 500 );
            var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
            var plane = new THREE.Mesh( geometry, material );
            plane.position.x = 0;
            plane.position.y = 0;
            plane.position.z = 0;
            SceneService.scene.add(plane);
        }
    }]);

