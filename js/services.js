'use strict';
//THREEJS
// For this example this is consumed by the directive and
// the model factory.

// Is this cached or is it actually returning a new scene?
app.service('SceneService', function () {
    var scene = new THREE.Scene();
    //scene.fog = new THREE.Fog( 0x808080, 3000, 6000 );
    // LIGHTS
    var ambientLight = new THREE.AmbientLight( 0x222222 );
    var light = new THREE.DirectionalLight( 0xffffff, 1.0 );
    light.position.set( 2, 4, 5 );
    
    var light2 = new THREE.DirectionalLight( 0xffffff, 1.0 );
    light2.position.set( -4, 2, -3 );

    scene.add(ambientLight);
    scene.add(light);
    scene.add(light2);

    return {
        scene: scene
    }
});

app.service('CoordinatesService', ['SceneService' , function(SceneService){

    var scene = SceneService.scene;

    this.grid = {};
    this.drawGrid = function(params) {
            params = params || {};
            var size = params.size !== undefined ? params.size:100;
            var scale = params.scale !== undefined ? params.scale:0.1;
            var orientation = params.orientation !== undefined ? params.orientation:"x";
            var grid = new THREE.Mesh(
                new THREE.PlaneGeometry(size, size, size * scale, size * scale),
                new THREE.MeshBasicMaterial({ color: 0x555555, wireframe: true }) 
                );
            // Yes, these are poorly labeled! It would be a mess to fix.
            // What's really going on here:
            // "x" means "rotate 90 degrees around x", etc.
            // So "x" really means "show a grid with a normal of Y"
            //    "y" means "show a grid with a normal of X"
            //    "z" means (logically enough) "show a grid with a normal of Z"
            if (orientation === "x") {
                grid.rotation.x = - Math.PI / 2;
                grid.position.x = size/2;
                grid.position.z = size/2;
            } else if (orientation === "y") {
                grid.rotation.y = - Math.PI / 2;
                grid.position.y = size/2;
                grid.position.z = size/2;
            } else if (orientation === "z") {
                grid.rotation.z = - Math.PI / 2;
                grid.position.x = size/2;
                grid.position.y = size/2;
            }

            scene.add(grid);
            this.grid[orientation] = grid;
    };
    this.drawGround = function(params) {
            params = params || {};
            var size = params.size !== undefined ? params.size:100;
            var color = params.color !== undefined ? params.color:0xFFFFFF;
            var ground = new THREE.Mesh(
                new THREE.PlaneGeometry(size, size),
                // When we use a ground plane we use directional lights, so illuminating
                // just the corners is sufficient.
                // Use MeshPhongMaterial if you want to capture per-pixel lighting:
                // new THREE.MeshPhongMaterial({ color: color, specular: 0x000000,
                new THREE.MeshLambertMaterial({ color: color,
                    // polygonOffset moves the plane back from the eye a bit, so that the lines on top of
                    // the grid do not have z-fighting with the grid:
                    // Factor == 1 moves it back relative to the slope (more on-edge means move back farther)
                    // Units == 4 is a fixed amount to move back, and 4 is usually a good value
                    polygonOffset: true, polygonOffsetFactor: 1.0, polygonOffsetUnits: 4.0
                }));
            ground.rotation.x = - Math.PI / 2;
            ground.position.x = size/2;
            ground.position.z = size/2;
            scene.add(ground);

            this.ground = ground;
    };

    this.drawAllAxes = function(params) {
            params = params || {};
            var axisRadius = params.axisRadius !== undefined ? params.axisRadius:0.04;
            var axisLength = params.axisLength !== undefined ? params.axisLength:11;
            var axisTess = params.axisTess !== undefined ? params.axisTess:48;

            var axisXMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
            var axisYMaterial = new THREE.MeshLambertMaterial({ color: 0x00FF00 });
            var axisZMaterial = new THREE.MeshLambertMaterial({ color: 0x0000FF });
            axisXMaterial.side = THREE.DoubleSide;
            axisYMaterial.side = THREE.DoubleSide;
            axisZMaterial.side = THREE.DoubleSide;
            var axisX = new THREE.Mesh(
                new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true), 
                axisXMaterial
                );
            var axisY = new THREE.Mesh(
                new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true), 
                axisYMaterial
                );
            var axisZ = new THREE.Mesh(
                new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true), 
                axisZMaterial
                );
            axisX.rotation.z = - Math.PI / 2;
            axisX.position.x = axisLength/2-1;

            axisY.position.y = axisLength/2-1;
            
            axisZ.rotation.y = - Math.PI / 2;
            axisZ.rotation.z = - Math.PI / 2;
            axisZ.position.z = axisLength/2-1;

            scene.add( axisX );
            scene.add( axisY );
            scene.add( axisZ );

            var arrowX = new THREE.Mesh(
                new THREE.CylinderGeometry(0, 4*axisRadius, 4*axisRadius, axisTess, 1, true), 
                axisXMaterial
                );
            var arrowY = new THREE.Mesh(
                new THREE.CylinderGeometry(0, 4*axisRadius, 4*axisRadius, axisTess, 1, true), 
                axisYMaterial
                );
            var arrowZ = new THREE.Mesh(
                new THREE.CylinderGeometry(0, 4*axisRadius, 4*axisRadius, axisTess, 1, true), 
                axisZMaterial
                );
            arrowX.rotation.z = - Math.PI / 2;
            arrowX.position.x = axisLength - 1 + axisRadius*4/2;

            arrowY.position.y = axisLength - 1 + axisRadius*4/2;

            arrowZ.rotation.z = - Math.PI / 2;
            arrowZ.rotation.y = - Math.PI / 2;
            arrowZ.position.z = axisLength - 1 + axisRadius*4/2;

            scene.add( arrowX );
            scene.add( arrowY );
            scene.add( arrowZ );

            this.axes = [ axisX , axisY, axisZ , arrowX , arrowY , arrowZ];
    };

    this.removeGround = function () {
        scene.remove(this.ground);
    };

    this.removeAxes = function () {
        this.axes.forEach(function(object){
            scene.remove(object);
        });
    };

    this.removeGrid = function (orientation) {
        scene.remove(this.grid[orientation]);
    };


}]);

// Returns a single instance of a camera.  Consumed by directive and controls.
app.service('CameraService', function () {
    // default values for camera
    var viewAngle = 45;
    var aspectRatio = window.innerWidth / window.innerHeight;
    var near = 0.1
    var far = 150000;

    return { perspectiveCam:  new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far)}
});

app.service('MeshDataService', ['$http','SceneService', function ($http, SceneService) {
    this.getMesh = function (cellID, mip , x, y, z, color) {
        // I transform the error response, unwrapping the application dta from
        // the API response payload.
        var handleError = function( response ) {
            // The API response from the server should be returned in a
            // nomralized format. However, if the request was not handled by the
            // server (or what not handles properly - ex. server error), then we
            // may have to normalize it on our end, as best we can.
            if (
                ! angular.isObject( response.data ) ||
                ! response.data.message
                ) {return( $q.reject( "An unknown error occurred." ) ); }

            // Otherwise, use expected error message.
            return( $q.reject( response.data.message ) );

        };

        // I transform the successful response, unwrapping the application data
        // from the API response payload.
        var handleSuccess = function( response ) {

            if (response.data.length == 0){
                return false;
            }
            var vertices = new Float32Array(response.data);
            var material = new THREE.MeshPhongMaterial( { color: color, wireframe:false } );
            material.shinines = 150;
            material.specular.setHex(0x000000);
            
            //In case you are using a Lambert material
            //material.ambient.copy( material.color );
            var mesh = new THREE.Segment( vertices, material );

            mesh.position.set(x,y,z).multiplyScalar(128 * Math.pow(2, mip));
            mesh.scale.set(0.5, 0.5, 0.5);

            // add to the scene
            mesh.name = cellID;
            SceneService.scene.add(mesh);
            return true;

        };


        var cell_id = cellID * 10  + 1;
        var request = $http({
            responseType: 'arraybuffer',
            method: 'GET',
            url: 'http://data.eyewire.org/cell/'+cell_id+'/chunk/'+mip+'/'+x+'/'+y+'/'+z+'/mesh'
        });
        return( request.then(handleSuccess, handleError ));
    }
}])

// Adds a new model to the viewer with the provided x, y offset from the UI.  This specific model
// creates a tube that follows a collection of 3d points.
app.service('CellService', ['SceneService','MeshDataService', function (SceneService, MeshDataService) {
    this.addCell = function (cellID) {
        var mip = 6;
        var color = '#'+Math.floor(Math.random()*16777215).toString(16);

        for ( var x = 0; x < 4 ; x++){
            for ( var y = 0; y < 4; y++){
                for ( var z=0; z < 4; z++){
                    MeshDataService.getMesh(cellID, mip , x, y , z, color);
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
}]);



app.service("util", ["$window",
  function($window) {
      var util = this;
      var setTimeout = $window.setTimeout,
      clearTimeout = $window.clearTimeout;
      util.toArray = function(a) {
          return a.forEach ? a : [a]
      };
      util.list = function(a, b) {
          var length = a.length;

          util.toArray(b).forEach(function(b) {
              a.push(b);
          });
          return a.length - length
      };
      util.unlist = function(a, b) {
          var c = a.indexOf(b);
          return~ c && a.splice(c, 1), a.length
      };
      util.move = function(a, b, c) {
          return a.splice(c, 0, a.splice(b, 1)[0]), a
      };
      util.pad = function(a, b) {
          return Array(a + 1).join(b || " ")
      };
      util.buildUrl = function(url, params) {
          if (!params) return url;
          var f = [];
          angular.forEach(params, function(c, e) { 
              c = util.toJson(c);
              f.push(encodeURIComponent(e) + "=" + encodeURIComponent(c));
          })
          return url + (-1 == url.indexOf("?") ? "?" : "&") + f.join("&")
      };
      util.element = function(b) {
          return angular.isString(b) && (b = $window.document.getElementById(b)), angular.element(b)
      };
      util.randomHex = function(a) {
          for (var b = ""; a > 0;) b += Math.floor(Math.random() * Math.pow(10, 16)).toString(16).substr(0, 8 > a ? a : 8), a -= 8;
              return b
      };
      util.generateId = function() {
          return Math.floor(Date.now() / 1e3).toString(16) + util.randomHex(16)
      };
      util.throttle = function(a, b) {
          var c = null;
          return function() {
              clearTimeout(c), c = setTimeout(function() {
                  a.apply(this, arguments), c = null
              }, b)
          }
      };
      util.keys = Object.keys;
      util.toJson = $window.JSON.stringify;
      ["copy", "extend", "forEach", "identity", "fromJson", "isObject", "isString", "isArray", "lowercase", "noop"].forEach(function(b) {
          util[b] = angular[b]
      });
  }
]);