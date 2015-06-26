var app = angular.module("cellPane", []);

//The actual routing is done in the uiController
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
    
app.run(["$rootScope", "collection", "UtilService",  "KeyboardFactory", "modal", "notifier", "$window", "locale", 
    function($rootScope, collection, util,  keyboard, modal, notifier, $window, locale) {

      $window.collection = collection;
      $window.notify = notifier.notify;
      $rootScope._ =  ($window.navigator, locale._);
      $rootScope.change = false;
      $rootScope.$on("ready", function() {
          $rootScope.ready = true
      });

      $rootScope.sets = collection({
          cells: [],
          isNeeded: function(set) {
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
              var index = $rootScope.cells.getIndex(cellID);
              return  $rootScope.cells[index].key;
          },
          has: function(cellID) {
            for ( var i = 0; $rootScope.cells.length ; i++){
              if ($rootScope.cells[i] == cellID){
                return true;
              }
            }
            return false;
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
