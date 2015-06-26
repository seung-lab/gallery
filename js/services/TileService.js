
//Two Dimensional view services
(function() {
app.service('TileService', ['$http', function($http) {

  var plane = new THREE.PlaneBufferGeometry(128, 128, 1, 1);
  var empty = {
    channel: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAIAAABMXPacAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAATpJREFUeNrs18ENgCAQAEE09iJl0H8F2o0N+DTZh7NPcr/JEdjWWuOtc87X8/u6zH84vw+lAQAAQAAACMA/O7zH23kb4AoCIAAABACAin+A93g7bwNcQQAEAIAAAFDxD/Aeb+dtgCsIgAAAEAAAKv4B3uPtvA1wBQEQAAACAEDFP8B7vJ23Aa4gAAIAQAAAqPgHeI+38zbAFQRAAAAIAAAV/wDv8XbeBriCAAgAAAEAoOIf4D3eztsAVxAAAQAgAABU/AO8x9t5G+AKAiAAAAQAgIp/gPd4O28DXEEABACAAABQ8Q/wHm/nbYArCIAAABAAACr+Ad7j7bwNcAUBEAAAAgBAxT/Ae7ydtwGuIAACAEAAAKj4B3iPt/M2wBUEQAAACAAAFf8A7/F23ga4ggAIAAABAKCgR4ABAIa/f2QspBp6AAAAAElFTkSuQmCC",
    segmentation: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC"
  };

  //volumes contains the metada for each volume, and the images for channel and/or segmentation.
  var volumes = {};

  //Tile contains all the meshes for a plane , data is get from volumes and apply as a texture to the tiles.
  var tiles = {};
  window.tiles = tiles;

  var visibleChunks;
  var zpos;

  this.viewportChanged = function( center, viewSize , scene ){
    //This maps from global coordinates to chunk coordinates
    // 224 is the size of each chunk (256 - 32) where 32 is the overlapping between cubes
    // 18 , 50 and - 14 are the offsets for each axis 
    var chunk_coord = { xmin:Math.floor(((center.x - viewSize.x/2 - 32) - 18)/224.0 - 1),
                  ymin:Math.floor(((Math.abs(center.y) - viewSize.y/2 - 32) - 50)/224.0 - 1),
                  zmin:Math.floor((center.z + 14)/224 - 1),
                  xmax:Math.ceil(((center.x + viewSize.x/2 + 32) - 18)/224 - 1),
                  ymax:Math.ceil(((Math.abs(center.y) + viewSize.y/2 + 32) - 50)/224 - 1),
                  zmax:Math.ceil((center.z + 14)/224 - 1)
                }

    // Load new visible chunks and maybe some soon to be visible ones
    if ( JSON.stringify(chunk_coord) !=  JSON.stringify(visibleChunks)) {
      visibleChunks = chunk_coord;

      for ( var x = chunk_coord.xmin; x < chunk_coord.xmax ; ++x) 
        for ( var y = chunk_coord.ymin; y < chunk_coord.ymax; ++y) 
          for ( var z = chunk_coord.zmin ; z < chunk_coord.zmax; ++z) { 
            this.initializeChunk({ x:x, y:y, z:z }, scene);
            updateTexture({x:x, y:y, z:z});
          }
    }

    //update textures
    var z_chunk = (center.z + 14)/224 - 1; 
    var new_zpos = Math.round((z_chunk - chunk_coord.zmin) * 224);
    if ( zpos != new_zpos ) {
      zpos = new_zpos;
      for ( var x = chunk_coord.xmin; x < chunk_coord.xmax ; ++x) 
        for ( var y = chunk_coord.ymin; y < chunk_coord.ymax; ++y) 
          for ( var z = chunk_coord.zmin ; z < chunk_coord.zmax; ++z) 
            updateTexture({x:x, y:y, z:z});
    }
  };

  this.initializeChunk = function (task_coord, scene) {
    var str_coord = JSON.stringify(task_coord);
    if (!(str_coord in volumes)) {
      volumes[str_coord] = {};
      
      var color = '#'+Math.floor(Math.random()*167772).toString(16);

      for ( var x = 0; x < 2; ++x ) {
        for ( var y = 0; y < 2; ++y) {

          var chunk_coord = JSON.stringify({ x_task: task_coord.x, y_task: task_coord.y, x_chunk: x , y_chunk: y});

          tiles[chunk_coord] = {};
          tiles[chunk_coord].texture = new THREE.ImageUtils.loadTexture(empty.channel);
          tiles[chunk_coord].material = new THREE.MeshBasicMaterial({ map:tiles[chunk_coord].texture});
          tiles[chunk_coord].mesh = new THREE.Mesh(plane , tiles[chunk_coord].material );

          tiles[chunk_coord].mesh.position.x =  (task_coord.x + 1) * 224 + 18 + 128 / 2 + 128 * x;
          tiles[chunk_coord].mesh.position.y =  -1 * ((task_coord.y + 1) * 224 + 50 + 128 / 2 + 128 * y);

          scene.add(tiles[chunk_coord].mesh);
        }
      }       

      this.volume(task_coord, function(metadata) {
        volumes[str_coord].metadata = metadata;
        getChannel(task_coord, metadata.channel.id );
      });
    }
  }

  var getChannel = function ( task_coord , channel_id ) {
    var str_coord = JSON.stringify(task_coord);
    volumes[str_coord].channel = {};

    for ( var x = 0; x < 2; ++x ) {
      for ( var y = 0; y < 2; ++y) { 
        for ( var z = 0; z < 2; ++z) {
          
          (function (x, y, z ) {
            var req = {
              responseType: 'json',
              method: 'GET',
              url: 'http://data.eyewire.org/volume/'+channel_id+'/chunk/0/'+x+'/'+y+'/'+z+'/tile/xy/0:128',
            };

            var chann_coord = JSON.stringify({x:x, y:y, z:z});

            $http(req).
            success(function(data, status, headers, config) {
              volumes[str_coord].channel[chann_coord] = data;
              updateTexture(task_coord);
            }).
            error(function(data, status, headers, config) {
              console.error(headers);
            });

          })(x,y,z);
        }
      }
    }
  };

    var updateTexture = function(task_coord) {

      var str_coord = JSON.stringify(task_coord);
      var z = zpos < 128  ? 0 : 1;

      for ( var x_chunk = 0; x_chunk < 2; ++x_chunk ) {
        for ( var y_chunk = 0; y_chunk < 2; ++y_chunk) {
          var chann_coord = JSON.stringify({x:x_chunk, y:y_chunk, z:z});
          var src;
          try {
              src = volumes[str_coord].channel[chann_coord][zpos - 128 * z].data;
          } catch (e) {
              src = empty.channel;
          }
          var image = new Image();
          image.src = src;

          var chunk_coord = JSON.stringify({ x_task: task_coord.x, y_task: task_coord.y, x_chunk: x_chunk , y_chunk: y_chunk});
          tiles[chunk_coord].texture.image = image;
          tiles[chunk_coord].texture.needsUpdate = true;
        }
      }
    } 


    this.volume = function( coord , callback){
      var url = 'https://eyewire.org/2.0/volumes/atcoord/'+coord.x+'/'+coord.y+'/'+coord.z;
      $http.get(url).
      success(function(data, status, headers, config) {
        callback(data);
     }).
      error(function(data, status, headers, config) {
        console.error(headers);
      });
    }
}]);
})();
