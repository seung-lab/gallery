'use strict';



(function (app) {

app.factory("Sets", ["$http", "UtilService", '$resource',
  function($http, util, $resource) {

    var api = $resource('/api/sets/:id', { id: '@id'  } 
      ,{ 
        'update': { method:'PUT' },
        'delete': { method:'DELETE'}
      });


    var run = function(callback) {

      var c = this;
      api.query(function(all){
         
        all.forEach(function(element) {

          c.push(element);
        });

        callback();
      });

      return  this;
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
   
    return function() {
      var srcObject = {
        run: run,
        save: save,
        remove: remove,
        removeLocal: removeLocal,
        getIndex: getIndex,
        get: get
      };

      //Extends the destination object dst by copying own enumerable properties from the src and arg object(s) to dst. 
      var dstObject = [];
      util.extend(dstObject, srcObject);
      return dstObject;
    }
}]);

})(app);
