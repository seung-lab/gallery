'use strict';

(function (app) {

app.factory("CollectionFactory", ["$http", "UtilService",
  function($http, util) {

    var run = function(callback) {
      this.syncDown(callback || util.noop);
      return  this;
    };
    var syncDown = function(callback) {
      var c = this;
      var url = util.buildUrl(this.url, this.params);

      $http.get(url).success(function(jsonArray) {
        jsonArray.forEach(function(element) {
          c[element._id] ? c.saveLocal(element) : c.add(element, null)
        });
      }).success(callback).error(callback)

      return this;
    };
    var saveLocal = function(a) {
      var b = this,
      id = a._id;
      "trash" == a.status ? b.removeLocal(id) : util.extend(b[id], a)
    };

    var add = function(element, b) {
      if (this.isNeeded(element)){
        this.push(element);
      } 
      else {
        this.aux.push(element);
      }

      if(b){
        b.call(this, element);
      }

    };
    var removeLocal = function(a) {
      var b = this;
      util.unlist(b, b[a]), delete b[a]
    };
    var remove = function(a) {
      var b = this;
      return b[a].status = "trash", util.unlist(b, b[a]), b.save(b[a], function() {
        b.removeLocal(a)
      })
    };
    var save = function(a, b) {
      var c = this,
      e = a._id;
      if (e || (e = a._id = util.generateId(), a._acl || (a._acl = {}), a._acl.creator = "demo@cellpane.com", !c.onNew || c.onNew(a))) return c[e] ? util.extend(c[e], a) : c.push(c[e] = a), b && b(), e
    };
    var isOwner = function() {
      return !0
    };
    var isWriter = function(a) {
      return this.isOwner(a) || a._acl.w && ~a._acl.w.indexOf(auth.id())
    };
    var getOwner = function(a) {
      return this[a]._acl.creator
    };
    var addReader = function(a, b) {
      var c = this,
      e = c[a]._acl.r;
      return e || (e = c[a]._acl.r = []), util.list(e, b), c
    };
    var addWriter = function(a, b) {
      var c = this,
      e = c[a]._acl.w;
      return e || (e = c[a]._acl.w = []), util.list(e, b), c
    };
    var removeReader = function(a, b) {
      var c = this,
      e = c[a]._acl.r;
      return e && util.unlist(e, b), c
    };
    var removeWriter = function(a, b) {
      var c = this,
      e = c[a]._acl.w;
      return e && util.unlist(e, b), c
    };
    var getReaders = function(a) {
      var b = this[a]._acl;
      return b && b.r || []
    };
    var getWriters = function(a) {
      var b = this[a]._acl;
      return b && b.w || []
    };
    var setReaders = function(a, b) {
      var c = this,
      d = c[a]._acl;
      return d.r = b, c
    };
    var setWriters = function(a, b) {
      var c = this,
      d = c[a]._acl;
      return d.w = b, c
    };

    var getIndex = function(id){
      for (var index = 0; index < this.length; index++) {
        if (this[index]._id == id){
          return index;
        }
      }
      return -1;
    }

    //This is overwrite for cells and sets
    var isNeeded = function() {
          return true;
    }
    return function(argObject) {
      var srcObject = {
        url: "",
        run: run,
        save: save,
        remove: remove,
        isOwner: isOwner,
        isWriter: isWriter,
        getOwner: getOwner,
        syncDown: syncDown,
        addWriter: addWriter,
        addReader: addReader,
        removeWriter: removeWriter,
        removeReader: removeReader,
        getReaders: getReaders,
        getWriters: getWriters,
        setReaders: setReaders,
        setWriters: setWriters,
        add: add,
        saveLocal: saveLocal,
        removeLocal: removeLocal,
        getIndex: getIndex,
        isNeeded: isNeeded
      };

      //Extends the destination object dst by copying own enumerable properties from the src and arg object(s) to dst. 
      var dstObject = [];
      util.extend(dstObject, srcObject, argObject);
      return dstObject;
    }
}]);

})(app);