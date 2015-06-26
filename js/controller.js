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
app.controller("confirmController", ["$scope", "$routeParams", "$rootScope", "UtilService", "$location",
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
app.controller("newController", ["$scope", "$rootScope", "transposer", "cellMode", "$routeParams", "UtilService", "locale", "notifier",
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

app.controller("shareController", ["$scope", "$routeParams", "$rootScope", "md5", "UtilService",
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



