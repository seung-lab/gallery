'use strict';

( function (app) {
app.controller("UIController", ["$scope", "$rootScope", "$routeParams", "$location", "SettingsFactory", "UtilService", "KeyboardFactory", "TransitionerFactory", "LocaleFactory", "$timeout", "ModalFactory",
  function($scope, $rootScope, $routeParams, $location, settings, util, keyboard, transitioner, locale, $timepout, modal) {
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
          e && f && (a = sets[e].children, a.forEach(function(a, c) {
              a.id == f && (b = c)
          }), b < a.length - 1 ? b++ : b = 0, $location.path("/set/" + e + "/" + a[b].id))
      };
      $scope.prevcell = function() {
          var a, b, e = $routeParams.setId,
          f = $routeParams.cellId;
          e && f && (a = sets[e].children, a.forEach(function(a, c) {
              a.id == f && (b = c)
          }), b > 0 ? b-- : b = a.length - 1, $location.path("/set/" + e + "/" + a[b].id))
      };
      $scope.trashSet = function() {
          $location.path("/"), sets.remove($routeParams.setId)
      };
      $scope.duplicateSet = function() {
          var a = sets[$routeParams.setId];
          $location.path("set/" + sets.save({
              name: a.name + " (" + locale._.copy + ")",
              cells: a.children.slice(0)
          }) + "/")
      };
      $scope.rmcell = function(b) {
          var e = $routeParams.setId,
          f = sets[e],
          g = f.children;
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
          util.move(d.children, a, b), sets.save(d)
      };
      $scope.iscellOwner = function() {
          return $routeParams.cellId && cells.isOwner(cells[$routeParams.cellId])
      };
      $scope.editcell = function(a) {
          $location.search("edit", a ? "clone" : void 0), modal("components/new.html")
      };
      $scope.canChangeKey = function() {
          var id = $routeParams.setId;
          return id ? sets.isWriter(sets[id]) : true
      };

      //This changes the views when the location changes
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
      });

      keyboard.on("c", function() {
          return $scope.$apply(function() {
              settings.toggle("hideChords")
          }), !1
      });

      keyboard.on("=", function() {
          var b = settings.settings.fontSize || 0;
          2 > b && (settings.set("fontSize", b + 1), $scope.$apply())
      });

      keyboard.on("-", function() {
          var b = settings.settings.fontSize || 0;
          b && (settings.set("fontSize", b - 1), $scope.$apply())
      });

      $scope.$emit("$routeChangeSuccess", {
          params: $routeParams
      })
}]);

})(app);