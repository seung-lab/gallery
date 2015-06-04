var app = angular.module("cellPane", []);

app.config(["$routeProvider", function($routeProvider) {
    $routeProvider.caseInsensitiveMatch = true;
    $routeProvider.when("/");
    $routeProvider.when("/set/:setId/:cellId");
    $routeProvider.when("/:view/:cellId");
    $routeProvider.otherwise("/");
}]);


//This is to allow cross-origin requests
app.config(function ($httpProvider) {        
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
    
//transitioner and platform not used
app.run(["$rootScope", "collection", "util",  "keyboard", "modal", "notifier", "$window", "locale", 
    function($rootScope, collection, util,  keyboard, modal, notifier, $window, locale) {

      $window.notify = notifier.notify;
      $rootScope._ =  ($window.navigator, locale._);
      $rootScope.change = false;
      $rootScope.$on("ready", function() {
          $rootScope.ready = true
      });

      $rootScope.sets = collection({
          cells: [],
          isNeeded: function(a) {
              var cells = this.cells,
                  d = a.cells;

              d.forEach(function(a) {
                  var id = a._id;
                  d[id] = a, util.list(cells, id)
              })

              return true;
          },
          getcell: function(setID, cellID) {
            var cells = this[setID].cells;
            for (var i = 0; i < cells.length; i++) {
              if (cells[i]._id == cellID) {
                return cells[i]
              }
            }
          },
          url: "sets.json"
      });
      $rootScope.cells = collection({
          url: "cells.json",
          getKey: function(cellID) {
              return  $rootScope.cells[cellID].key;
          }
      });

       $rootScope.sets.run(function() {
          $rootScope.cells.run(function() {
              $rootScope.$emit("ready")
          });
      });


      $rootScope.modal = modal;
      $rootScope.toggleState = function(b) {
          $rootScope[b] = !$rootScope[b];
          $rootScope.changedState = true;
      };
      $rootScope.resetState = function() {
          return $rootScope.changedState ? void($rootScope.changedState = false) : void["menu", "em"].forEach(function(b) {
              $rootScope[b] && ($rootScope[b] = false)
          });
      };

      //This slow down all animations
      //But there has to be another event after this changed is update
      keyboard.on("ctrl+shift", function() {
          $rootScope.slow = !$rootScope.slow;
      });

      //Displays some of the key bindings
      keyboard.on(["h", "?"], function() {
          modal("views/keyboard.html");
          $rootScope.$apply();
          return false;
      });
      keyboard.on("esc", function() {
          return true;
      });
}]);




var f = function() {
    var a = navigator.userAgent,
    b = {}, c = {};
    window.location.search.substring(1).split("&").forEach(function(a) {
        a = a.split("=");
        c[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
    });
    c.android ? (b.name = "android", b.version = c.android, b.native = !0) : c.ios ? (b.name = "ios", b.version = c.ios, b.native = !0) : /AppleWebKit/.test(a) && /Mobile\/\w+/.test(a) ? b.name = "ios" : ~a.toLowerCase().indexOf("firefox") && (b.name = "ff"), b.name && (document.documentElement.className += " " + b.name)
    app.constant("platform", b)
}(window);



 
var k = function(a, b) {
    app.service("util", ["$window",
        function(c) {
            var d = this,
            e = c.document,
            f = c.setTimeout,
            g = c.clearTimeout;
            d.toArray = function(a) {
                return a && a.forEach ? a : [a]
            }, d.list = function(a, b) {
                var c = a.length;
                return d.toArray(b).forEach(function(b) {
                    var c = a.indexOf(b);~
                    c || a.push(b)
                }), a.length - c
            }, d.unlist = function(a, b) {
                var c = a.indexOf(b);
                return~ c && a.splice(c, 1), a.length
            }, d.move = function(a, b, c) {
                return a.splice(c, 0, a.splice(b, 1)[0]), a
            }, d.pad = function(a, b) {
                return Array(a + 1).join(b || " ")
            }, d.buildUrl = function(c, e) {
                if (!e) return c;
                var f = [];
                return a.forEach(e, function(c, e) {
                    null !== c && c !== b && (a.isObject(c) && (c = d.toJson(c)), f.push(encodeURIComponent(e) + "=" + encodeURIComponent(c)))
                }), c + (-1 == c.indexOf("?") ? "?" : "&") + f.join("&")
            }, d.element = function(b) {
                return a.isString(b) && (b = e.getElementById(b)), a.element(b)
            }, d.randomHex = function(a) {
                for (var b = ""; a > 0;) b += Math.floor(Math.random() * Math.pow(10, 16)).toString(16).substr(0, 8 > a ? a : 8), a -= 8;
                    return b
            }, d.generateId = function() {
                return Math.floor(Date.now() / 1e3).toString(16) + d.randomHex(16)
            }, d.throttle = function(a, b) {
                var c = null;
                return function() {
                    var d = this,
                    e = arguments;
                    g(c), c = f(function() {
                        a.apply(d, e), c = null
                    }, b)
                }
            }, d.keys = Object.keys, d.toJson = c.JSON.stringify, ["copy", "extend", "forEach", "identity", "fromJson", "isObject", "isString", "isArray", "lowercase", "noop"].forEach(function(b) {
                d[b] = a[b]
            })
        }
        ])
}(angular);

app.value("cellMode", {
    startState: function() {
        return {
            next: "part"
        }
    },
    token: function(a, b) {
        var c = null;
        return "part" == b.next ? a.match(/^\[[1-9BCPIO]\](?=$|\n)/) ? (c = "part", b.next = "chords") : a.skip() : "chords" == b.next ? a.eat("\n") ? (c = "chords", b.next = "chord") : a.skip() : "chord" == b.next ? a.eat("\n") ? b.next = "text" : a.eatWhile(" ") ? /^[A-G]$/.test(a.peek()) || a.skip() : a.match(/^[A-G][#b12345679adgijmsu,\(\)]*(?:\/[A-G][#b]?)?(?=($| +|\n))/) ? c = "chord" : a.skip() : "text" == b.next ? a.match(/^.+\S/) ? (c = "text", b.next = "partOrChords") : a.skip() : "partOrChords" == b.next ? a.match(/^\n(?=\[)/) ? b.next = "part" : a.eat("\n") ? (c = "chords", b.next = "chord") : a.skip() : a.skip(), c
    }
});


//THREEJS