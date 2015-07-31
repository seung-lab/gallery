'use strict';



(function (app) {

app.factory("Sets", ["$http", "UtilService", '$resource',
  function($http, util, $resource) {

    var sets = this;

    var api = $resource('/api/sets/:id', { id: '@id'  } 
      ,{ 
        'update': { method:'PUT' }
      });


    var run = function(callback) {
      this.syncDown(callback || util.noop);
      return  this;
    };

    var syncDown = function(callback) {
      var c = this;
      var url = util.buildUrl(this.url, this.params);

      $http.get(url).success(function(jsonArray) {

        jsonArray.forEach(function(element) {

          c.push(element);
        });
      
      }).success(callback).error(callback)

      return this;
    };


    var removeLocal = function(index) {

      util.unlist(this, this[index]);
      delete this[index];
    };

    var remove = function(id) {
      var index = this.getIndex(id);

      this[index].status = "trash";

      util.unlist(this, this[index]);

    };

    var save = function(element, callback) {

      var c = this;
      api.save( element , function(set) {
        c.push(set);
        callback(set.id);
      });


       
    };
   

    var getIndex = function(id){
      for (var index = 0; index < this.length; index++) {
        if (this[index] && this[index].id == id) {
          return index;
        }
      }
      return -1;
    }

    var get = function(id) {

      var index = this.getIndex(id);

      if (index === -1 ){
        return undefined;
      }
      else {
        return this[index];
      }
    }

    function addChild (setId , childId) {

      api.get({id :setId}, function(set){

        set.children.push(childId);

        set.$update(function(){
          return true;
        });

      })
    }
    
    return function() {
      var srcObject = {
        url: "api/sets",
        run: run,
        save: save,
        remove: remove,
        syncDown: syncDown,
        removeLocal: removeLocal,
        getIndex: getIndex,
        get: get,
        addChild: addChild
      };

      //Extends the destination object dst by copying own enumerable properties from the src and arg object(s) to dst. 
      var dstObject = [];
      util.extend(dstObject, srcObject);
      return dstObject;
    }
}]);

})(app);
