'use strict';

(function (){
app.factory("OctLODFactory", ['Scene3DService', '$http',
  function (SceneService, $http) {

  var OctLOD = function (cellID, mip , x, y, z) {
    
    THREE.Object3D.call( this );

    this.mip = mip;
    this.name = cellID; 
    this.x = x;
    this.y = y;
    this.z = z;

    this.position.set(x,y,z * 1.4).multiplyScalar(128 * Math.pow(2, mip));
    this.scale.set(0.5, 0.5, 0.7);
    SceneService.scene.add(this);

    this.updateMatrix();
    this.matrixAutoUpdate = false;

    //Mip level 1 will be visible when the distance to the camera is between 256 and 512
    this.levels = [256,512,1024,2048,4096,8192,16384,32768];
    this.colors = [0xffffff,0xffffff,0xbf00ff,0x4b0082,0x0000ff,0x00ff00,0xff00000,0xff7f00,0xff0000]
    this.oct = [];
    this.octLoaded = false;
    this.state = 'loading';

    var scope = this;
    this.getOverviewMesh(cellID, mip , x, y, z, function(mesh) {
      console.log('loading');
      if(!mesh) {
        scope.state = 'null';
        return;} //posibly destroy object if there is no mesh

      scope.mesh = mesh;
      scope.add(mesh);
      scope.state = 'loaded';


      scope.center = new THREE.Vector3();
      scope.center.addVectors( mesh.boundingBox.max , mesh.boundingBox.min);
      scope.center.divideScalar(4);
      scope.center.z = scope.center.z * 1.4;
      scope.center.add(scope.position);
    });

    
  };
  OctLOD.prototype.constructor = OctLOD;

  OctLOD.prototype = Object.create( THREE.Object3D.prototype );

  //Update will be called for each cell, on only one volume with mip level 8
  //This called is been done in the directive on each new frame.
  //Each level can decide on being on, or off.
  OctLOD.prototype.update = function (camera) {

    if (this.state != 'loaded'){
      return;
    }

    var v1 = new THREE.Vector3();
    v1.setFromMatrixPosition( camera.matrixWorld );

    var distance = v1.distanceTo( this.center );

    this.setVisibility(false);
    this.mesh.visible = true;

    //Every chunk will at least have one children, from the 8 possibles ones.
    if ( this.mip > 0 && distance < this.levels[this.mip-1]) {
        
      if ( this.oct.length > 0 ) {
        if (!this.octLoaded){
          this.octLoaded = this.areChildrenLoaded();
          return;
        } 
        
        this.mesh.visible = false;

        this.oct.forEach(function(children){
          if ( children.state == 'loaded'){
            children.update(camera);
          }
        });
      } 
      else {
        this.loadChildren();  
      }
    }
  
  }
  
  OctLOD.prototype.loadChildren = function() {
    for ( var x = 0; x < 2 ; x++) {
      for ( var y = 0; y < 2; y++) {
        for ( var z = 0; z < 2; z++) {

          var oct_x = this.x * 2 + x;
          var oct_y = this.y * 2 + y;
          var oct_z = this.z * 2 + z;
          this.oct.push(new OctLOD(this.name , this.mip-1, oct_x, oct_y, oct_z));
        }
      }
    }     
  };

  OctLOD.prototype.areChildrenLoaded = function() {
    console.log('checking if children are loaded');
    this.oct.forEach(function(children){
      console.log(children.state);
      if (children.state == 'loading'){
        return false;
      }
    });
    return true;
  };


  OctLOD.prototype.setVisibility = function (visible) {
    
    if (this.state != 'loaded') {
      return;
    }
    
    this.mesh.visible = visible;
    this.oct.forEach(function(children){
      children.setVisibility(visible);
    });  
  };

  OctLOD.prototype.getOverviewMesh  = function (cellID, mip , x, y, z, callback) {

    var cell_id = cellID * 10  + 1;
    var req = {
        responseType: 'arraybuffer',
        method: 'GET',
        url: 'http://data.eyewire.org/cell/'+cell_id+'/chunk/'+mip+'/'+x+'/'+y+'/'+z+'/mesh'
    };
    var color =  this.colors[this.mip];

    $http(req).
    success(function(data, status, headers, config) {
      if (data.byteLength == 0){
        callback(false);
        return;
      }

      var vertices = new Float32Array(data);
      var material = new THREE.MeshLambertMaterial( { color:color, wireframe:false } );
      var mesh = new THREE.Segment( vertices, material );
      mesh.computeBoundingBox();

      callback(mesh);
    }).
    error(function(data, status, headers, config) {
      console.error(headers);
    });
  }

  return OctLOD;

}]);
})();