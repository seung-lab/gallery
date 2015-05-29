'use strict';

angular.module('threeViewer.services', [])

    // For this example this is consumed by the directive and
    // the model factory.

    // Is this cached or is it actually returning a new scene?
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

        return {
            perspectiveCam:  new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far)}
    })

    .service('MeshDataService', ['$http','SceneService', function ($http, SceneService) {
        this.getMesh = function (cellID, mip , x, y, z) {
            
            var cell_id = cellID * 10  + 1;
            var request = $http({
                method: 'GET',
                url: 'http://data.eyewire.org/cell/'+cell_id+'/chunk/'+mip+'/'+x+'/'+y+'/'+z+'/mesh',
                responseType: 'arraybuffer'
            });
            return( request.then( handleSuccess, handleError ) );

            // I transform the error response, unwrapping the application dta from
            // the API response payload.
            function handleError( response ) {

                // The API response from the server should be returned in a
                // nomralized format. However, if the request was not handled by the
                // server (or what not handles properly - ex. server error), then we
                // may have to normalize it on our end, as best we can.
                if (
                    ! angular.isObject( response.data ) ||
                    ! response.data.message
                    ) {

                    return( $q.reject( "An unknown error occurred." ) );

                }

                // Otherwise, use expected error message.
                return( $q.reject( response.data.message ) );

            }


            // I transform the successful response, unwrapping the application data
            // from the API response payload.
            function handleSuccess( response ) {

                var vertices = new Float32Array(response.data);
                if (vertices.length == 0){
                    return false;
                }
                             
                var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:false } );
                var mesh = new THREE.Segment( vertices, material );

                mesh.position.set(x,y,z).multiplyScalar(128 * Math.pow(2, mip));
                mesh.scale.set(0.5, 0.5, 0.5);
                  
                // add to the scene
                mesh.name = cellID;
                SceneService.scene.add(mesh);
                window.scene = SceneService.scene;
                return true;

            }
        }

    }])

    // Adds a new model to the viewer with the provided x, y offset from the UI.  This specific model
    // creates a tube that follows a collection of 3d points.
    .service('ModelFactory', ['SceneService','MeshDataService', function (SceneService, MeshDataService) {
        this.addCell = function (cellID) {
            var mip = 6;
            for ( var x = 0; x < 2 ; x++){
                for ( var y = 0; y < 2; y++){
                    for ( var z=0; z < 2; z++){
                        MeshDataService.getMesh(cellID, mip , x, y , z);
                    }
                }
            }
          
        }
        this.removeCell = function (cellID) {

            for (var index=0; index <  SceneService.scene.children.length ; index++){
                var object = SceneService.scene.children[index];
                if (object.name == cellID){
                    SceneService.scene.remove(object);
                    index--;
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

