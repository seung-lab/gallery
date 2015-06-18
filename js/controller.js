app.controller("addController", ["$scope", "$routeParams", "$rootScope",
  function($scope, $routeParams, $rootScope) {
      {
          var sets = $rootScope.sets;
      }
      $scope.s = sets.filter(function(a) {
          return sets.isWriter(a)
      });
      $scope.addNew = function(name) {

          return sets.save({
              name: name,
              cells: [{
                  _id: $routeParams.cellId
              }]
          })
      };

      $scope.addExisting = function(a) {
          var cellId = $routeParams.cellId,
          e = sets[a],
          f = e.cells;
          return f[cellId] ? true : (f.push(f[cellId] = {
              _id: cellId
          }), sets.save(e))
      }
  }
  ]);
app.controller("confirmController", ["$scope", "$routeParams", "$rootScope", "util", "$location",
  function(a, b, c, d, e) {
      var f = c.sets,
      g = c.cells;
      a.trashcell = function() {
          var a = b.cellId,
          c = b.setId;
          return f.forEach(function(b) {
              d.unlist(b.cells, a) || f.remove(b._id)
          }), e.path((c ? "set" : b.view) + "/" + (f[c] ? c + "/" : "")), g.remove(a)
      }
  }
  ]);
app.controller("newController", ["$scope", "$rootScope", "transposer", "cellMode", "$routeParams", "util", "locale", "notifier",
  function($scope, $rootScope, transposer, cellMode, $routeParams, util, locale, notifier) {
      var i = $rootScope.cells,
      j = $routeParams.edit,
      k = locale._;
      $scope.cellMode = cellMode, $scope.langs = locale.langs, j && ($scope.cell = util.extend({}, i[$routeParams.cellId]), "clone" == j && delete $scope.cell._id, $scope.cell.tempo = $scope.cell.tempo - 0), $scope.savecell = function(a, b) {
          var d = "(" + transposer.getScale(a.key).join("|") + ")";
          return~ a.body.search("^(?:\\[[1-9BCPIO]\\]\\n(?:(?: *" + d + "[1-9adgijmsu,\\(\\)]*(?:\\/" + d + ")?)*\\n[^\\[\\n].+\\S(?:\\n|$))+)+$") ? (a._acl = {}, b && (a._acl = {
              gr: !1
          }), i.save(a)) : void notifier.notify({
              message: k.checkBody,
              icon: "alert"
          })
      }, $scope.keys = transposer.getAllKeys()
  }
  ]);
app.controller("renameController", ["$scope", "$rootScope",
  function(a, b) {
      var c = b.sets;
      a.renameSet = function(a, b) {
          var d = c[a];
          return b !== d.name ? (d.name = b, c.save(d)) : !1
      }
  }
  ]);
app.controller("searchController", ["$scope", "$rootScope", "locale",
  function(a, b, c) {
      b.cells;
      a._ = c._, a.message = "", a.search = function() {}
  }
  ]);

// Used in views/settings.html
app.controller("settingsController", ["$scope", "settings",
  function($scope, settings) {
      window.settings = settings.settings;
      $scope.settings = settings.settings;
      $scope.toggle = function(property) {
          settings.toggle(property)
      };
      $scope.setFont = function(size) {
          settings.set("fontSize", size)
      }
  }
]);

app.controller("shareController", ["$scope", "$routeParams", "$rootScope", "md5", "util",
  function(a, b, c, d, e) {
      var f = e.list,
      g = e.unlist,
      h = c.sets,
      i = b.setId,
      j = a.e = h.getWriters(i).slice(0),
      k = a.c = h.getReaders(i).slice(0);
      a.owner = h.getOwner(i), a.md5 = d, a.allowAccess = function(a, b) {
          return f(k, a), "edit" == b ? f(j, a) : g(j, a), !0
      }, a.denyAccess = function(a) {
          g(j, a), g(k, a)
      }, a.isOwner = function() {
          return h.isOwner(h[i])
      }, a.save = function() {
          return h.setReaders(i, k).setWriters(i, j).save(h[i])
      }
  }
  ]);

app.controller("uiController", ["$scope", "$rootScope", "$routeParams", "$location", "settings", "util", "keyboard", "transposer", "transitioner", "locale", "$timeout", "modal",
  function($scope, $rootScope, $routeParams, $location, settings, util, keyboard, transposer, transitioner, locale, $timepout, modal) {
      function m(a, b, c) {
          var d, e, g, i, j, k, l, m, n, o = [];
      //     a.split("[").forEach(function(a) {
      //         if ("" !== a) {
      //             for (d = a.split("]"), k = "", g = d[1].replace(/[\r\t\v\f\0\x0B]|^\n+|\s+$/g, "").split("\n"), i = 0, j = g.length; j > i; i += 2) {
      //                 for (e = g[i + 1], e.length < g[i].length && (e += util.pad(g[i].length - e.length, " ")), n = 0, l = /\S+/g; m = l.exec(g[i]);) k += e.substring(n, m.index) + '<span class="c"><span>' + (b !== c ? transposer.transpose(m[0], b, c) : m[0]) + "</span></span>", n = m.index;
      //                     k += g[i + 1].substr(n) + "\n"
      //             }
      //             o.push({
      //                 type: d[0].toLowerCase(),
      //                 text: k
      //             })
      //         }
      //     })
           return o;
      }
      var sets = $rootScope.sets;
      var cells = $rootScope.cells;
      $rootScope.cellSlide = {
          to: "left"
      };
      $rootScope.viewSlide = {
          to: "left"
      };
      $rootScope.r = $routeParams;

      $rootScope.p = function(path) {
          $location.path(path);
      };
      $rootScope.q = function(a, b) {
          $location.search(a, b)
      };
      $rootScope._ = locale._;
      $scope.s = settings.settings;
      $scope.pad = util.pad;

      $scope.nextcell = function() {
          var a, b, e = $routeParams.setId,
          f = $routeParams.cellId;
          e && f && (a = sets[e].cells, a.forEach(function(a, c) {
              a._id == f && (b = c)
          }), b < a.length - 1 ? b++ : b = 0, $location.path("/set/" + e + "/" + a[b]._id))
      };
      $scope.prevcell = function() {
          var a, b, e = $routeParams.setId,
          f = $routeParams.cellId;
          e && f && (a = sets[e].cells, a.forEach(function(a, c) {
              a._id == f && (b = c)
          }), b > 0 ? b-- : b = a.length - 1, $location.path("/set/" + e + "/" + a[b]._id))
      };
      $scope.getKeys = function() {
          return $routeParams.cellId && cells[$routeParams.cellId] && transposer.getKeys("m" === cells[$routeParams.cellId].key.slice(-1)) || []
      };
      $scope.trashSet = function() {
          $location.path("/"), sets.remove($routeParams.setId)
      };
      $scope.duplicateSet = function() {
          var a = sets[$routeParams.setId];
          $location.path("set/" + sets.save({
              name: a.name + " (" + locale._.copy + ")",
              cells: a.cells.slice(0)
          }) + "/")
      };
      $scope.rmcell = function(b) {
          var e = $routeParams.setId,
          f = sets[e],
          g = f.cells;
          $location.path("set/" + e + "/"), g.splice(b, 1), g.length ? sets.save(f) : $scope.trashSet()
      };
      $scope.curKey = function() {
          return cells.getKey($routeParams.cellId);
      };
      $scope.updateKey = function(b, d) {
          var e, f, g = $routeParams.setId,
          h = $routeParams.cellId,
          i = cells[h];
          g && (e = sets[g], f = sets.getcell(g, h), b !== i.key ? f.key = b : delete f.key, !d && sets.save(e)), $scope.k != b && ($rootScope.cellSlide.model = m(i.body, i.key, b), $scope.k = b)
      };
      $scope.clean = function(a) {
          delete this[a]
      };
      $scope.sortSet = function(a, b) {
          util.move(sets, a, b)
      };
      $scope.sortcell = function(a, b) {
          var d = sets[$routeParams.setId];
          util.move(d.cells, a, b), sets.save(d)
      };
      $scope.iscellOwner = function() {
          return $routeParams.cellId && cells.isOwner(cells[$routeParams.cellId])
      };
      $scope.editcell = function(a) {
          $location.search("edit", a ? "clone" : void 0), modal("views/new.html")
      };
      $scope.canChangeKey = function() {
          var a = $routeParams.setId;
          return a ? sets.isWriter(sets[a]) : true
      };

      //This changes the views when the location
      $scope.$on("$routeChangeSuccess",
       function($routeChangeSuccess, to, from) {
          if ("/" === $location.path()){
            $location.path(sets.length ? "sets/" : "search/");
            return;
          }

          var fromView, fromSetId, fromCellId;
          if ( from ){
            fromView = from.params.view;
            fromSetId = from.params.setId;
            fromCellId = from.params.cellId;
          }

          if (to) {
            if (to.params.view) {
                if (-1 == ["sets", "catalog", "search"].indexOf(to.params.view)){
                  $location.path(sets.length ? "sets/" : "search/");
                  return;
                }

                if (fromSetId) {
                  $rootScope.viewSlide.to = "right";
                  $rootScope.viewSlide.model = to.params.view;
                }
                else if (to.params.view != fromView) {
                  $rootScope.viewSlide.to = "left";
                  $rootScope.viewSlide.model = to.params.view;
                }
            }
            
            if (to.params.setId) {
                var setIndex = sets.getIndex(to.params.setId);
                if (!sets[setIndex]){
                  $location.path(sets.length ? "sets/" : "search/");
                  return;
                }   
                
                if(to.params.setId != fromSetId) {
                  $rootScope.viewSlide.force = true;
                  $rootScope.viewSlide.to = "left";
                  $rootScope.viewSlide.model = "set";
                }
            }
            if (to.params.cellId) {
              var cellIndex = cells.getIndex(to.params.cellId);
              if (cells[cellIndex]){

                var body = m(cells[cellIndex].body);
                $scope.k = $scope.curKey();

                if (to.params.cellId !== fromCellId) {
                  if (fromSetId === to.params.setId 
                    //&& sets[to.params.setId].cells.indexOf(cellId) < sets[to.params.setId].cells.indexOf(fromCellId) 
                    ) {
                    $rootScope.cellSlide.to = "left";
                    $rootScope.cellSlide.model = body;
                    return;
                  }
                  else {
                    $rootScope.cellSlide.to = "left"; 
                    $rootScope.cellSlide.model = body;
                    return; 
                  }
                } 
                else {
                  transitioner.apply("cell-view", function() {
                    $rootScope.cellSlide.model = ""
                  });
                  return;
                }   
              }
                        
            //If we couldn't find the cell go back to the view
            $location.path(to.params.view + "/");
            return;
          }
          } 
      });
      keyboard.on(["left", "k", "up", "pageup"], function() {
          return $scope.$apply(function() {
              $scope.prevcell()
          }), !1
      }).on("c", function() {
          return $scope.$apply(function() {
              settings.toggle("hideChords")
          }), !1
      }).on("=", function() {
          var b = settings.settings.fontSize || 0;
          2 > b && (settings.set("fontSize", b + 1), $scope.$apply())
      }).on("-", function() {
          var b = settings.settings.fontSize || 0;
          b && (settings.set("fontSize", b - 1), $scope.$apply())
      });
      $scope.$emit("$routeChangeSuccess", {
          params: $routeParams
      })
}]);

//THREEJS

// Control that manages changes to the 3d scene
app.controller('SceneControl', ['$scope', 'CellService', 'CameraService',
  function ($scope, CellService, CameraService) {
      $scope.camera = { x:10000 , y:10000, z:10000};
     
      var cells = new Set();
      $scope.cellID = 11;


      $scope.addCell = function () {

          if(!cells.has($scope.cellID)){
              cells.add($scope.cellID);
              CellService.addCell($scope.cellID);
          }
      }

      $scope.removeCell = function () {

          if(cells.has($scope.cellID)){
              cells.delete($scope.cellID);
              CellService.removeCell($scope.cellID);
          }
      }

      $scope.moveCamera = function () {
          CameraService.perspectiveCam.position.x = $scope.camera.x;
          CameraService.perspectiveCam.position.y = $scope.camera.y;
          CameraService.perspectiveCam.position.z = $scope.camera.z;
      }
      // brings camera out
      $scope.increaseCameraZ = function () {
          CameraService.perspectiveCam.position.z += 50;
      }

      //brings camera in
      $scope.decreaseCameraZ = function () {
          CameraService.perspectiveCam.position.z -= 50;
      }
}]);
