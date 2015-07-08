
'use strict';
//Two Dimensional view services

(function (app, THREE) {

app.service('TileService', ['$http', function($http) {

  var plane = new THREE.PlaneBufferGeometry(128, 128, 1, 1);
  var empty = {
    channel: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAIAAABMXPacAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAATpJREFUeNrs18ENgCAQAEE09iJl0H8F2o0N+DTZh7NPcr/JEdjWWuOtc87X8/u6zH84vw+lAQAAQAAACMA/O7zH23kb4AoCIAAABACAin+A93g7bwNcQQAEAIAAAFDxD/Aeb+dtgCsIgAAAEAAAKv4B3uPtvA1wBQEQAAACAEDFP8B7vJ23Aa4gAAIAQAAAqPgHeI+38zbAFQRAAAAIAAAV/wDv8XbeBriCAAgAAAEAoOIf4D3eztsAVxAAAQAgAABU/AO8x9t5G+AKAiAAAAQAgIp/gPd4O28DXEEABACAAABQ8Q/wHm/nbYArCIAAABAAACr+Ad7j7bwNcAUBEAAAAgBAxT/Ae7ydtwGuIAACAEAAAKj4B3iPt/M2wBUEQAAACAAAFf8A7/F23ga4ggAIAAABAKCgR4ABAIa/f2QspBp6AAAAAElFTkSuQmCC',
    segmentation: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC'
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
    var chunkCoord = { xmin:Math.floor(((center.x - viewSize.x/2 - 32) - 18)/224.0 - 1),
                  ymin:Math.floor(((Math.abs(center.y) - viewSize.y/2 - 32) - 50)/224.0 - 1),
                  zmin:Math.floor((center.z + 14)/224 - 1),
                  xmax:Math.ceil(((center.x + viewSize.x/2 + 32) - 18)/224 - 1),
                  ymax:Math.ceil(((Math.abs(center.y) + viewSize.y/2 + 32) - 50)/224 - 1),
                  zmax:Math.ceil((center.z + 14)/224 - 1)
                };

    // Load new visible chunks and maybe some soon to be visible ones
    if ( JSON.stringify(chunkCoord) !==  JSON.stringify(visibleChunks)) {
      visibleChunks = chunkCoord;

      for ( var x = chunkCoord.xmin; x < chunkCoord.xmax ; ++x) {
        for ( var y = chunkCoord.ymin; y < chunkCoord.ymax; ++y) {
          for ( var z = chunkCoord.zmin ; z < chunkCoord.zmax; ++z) { 
            
            this.initializeChunk({ x:x, y:y, z:z }, scene);
            updateTexture({x:x, y:y, z:z});

          }
        }
      }
    
    }

    //update textures
    var zChunk = (center.z + 14)/224 - 1; 
    var newZpos = Math.round((zChunk - chunkCoord.zmin) * 224);
    if ( zpos !== newZpos ) {
      zpos = newZpos;
      
      for ( var x = chunkCoord.xmin; x < chunkCoord.xmax ; ++x) {
      
        for ( var y = chunkCoord.ymin; y < chunkCoord.ymax; ++y) {
      
          for ( var z = chunkCoord.zmin ; z < chunkCoord.zmax; ++z) { 
            updateTexture({x:x, y:y, z:z});
      
          }
      
        }
      
      }
    }
  };

  this.initializeChunk = function (taskCoord, scene) {
    var strCoord = JSON.stringify(taskCoord);
    if (!(strCoord in volumes)) {
      volumes[strCoord] = {};
      
      for ( var x = 0; x < 2; ++x ) {
        for ( var y = 0; y < 2; ++y) {

          var chunkCoord = JSON.stringify({ xTask: taskCoord.x, yTask: taskCoord.y, xChunk: x , yChunk: y});

          tiles[chunkCoord] = {};
          tiles[chunkCoord].texture = new THREE.ImageUtils.loadTexture(empty.channel);
          tiles[chunkCoord].material = new THREE.MeshBasicMaterial({ map:tiles[chunkCoord].texture});
          tiles[chunkCoord].mesh = new THREE.Mesh(plane , tiles[chunkCoord].material );

          tiles[chunkCoord].mesh.position.x =  (taskCoord.x + 1) * 224 + 18 + 128 / 2 + 128 * x;
          tiles[chunkCoord].mesh.position.y =  -1 * ((taskCoord.y + 1) * 224 + 50 + 128 / 2 + 128 * y);

          scene.add(tiles[chunkCoord].mesh);
        }
      }       

      this.volume(taskCoord, function(metadata) {
        volumes[strCoord].metadata = metadata;
        getChannel(taskCoord, metadata.channel.id );
      });
    }
  };

  var getChannel = function ( taskCoord , channelId ) {
    var strCoord = JSON.stringify(taskCoord);
    volumes[strCoord].channel = {};

    for ( var x = 0; x < 2; ++x ) {
      for ( var y = 0; y < 2; ++y) { 
        for ( var z = 0; z < 2; ++z) {
          
          (function (x, y, z ) {
            var req = {
              responseType: 'json',
              method: 'GET',
              url: 'http://data.eyewire.org/volume/'+channelId+'/chunk/0/'+x+'/'+y+'/'+z+'/tile/xy/0:128',
            };

            var channCoord = JSON.stringify({x:x, y:y, z:z});

            $http(req).
            success(function(data, status, headers, config) {
              volumes[strCoord].channel[channCoord] = data;
              updateTexture(taskCoord);
            }).
            error(function(data, status, headers) {
              console.error(headers);
            });

          })(x,y,z);
        }
      }
    }
  };

    var updateTexture = function(taskCoord) {

      var strCoord = JSON.stringify(taskCoord);
      var z = zpos < 128  ? 0 : 1;

      for ( var xChunk = 0; xChunk < 2; ++xChunk ) {
        for ( var yChunk = 0; yChunk < 2; ++yChunk) {
          var channCoord = JSON.stringify({x:xChunk, y:yChunk, z:z});
          var src;
          try {
              src = volumes[strCoord].channel[channCoord][zpos - 128 * z].data;
          } catch (e) {
              src = empty.channel;
          }
          var image = new Image();
          image.src = src;

          var chunkCoord = JSON.stringify({ xTask: taskCoord.x, yTask: taskCoord.y, xChunk: xChunk , yChunk: yChunk});
          tiles[chunkCoord].texture.image = image;
          tiles[chunkCoord].texture.needsUpdate = true;
        }
      }
    };


    this.volume = function( coord , callback){
      var url = 'https://eyewire.org/2.0/volumes/atcoord/'+coord.x+'/'+coord.y+'/'+coord.z;
      $http.get(url).
      success(function(data) {
        callback(data);
     }).
      error(function(data, status, headers) {
        console.error(headers);
      });
    };
}]);

})(app,THREE);
