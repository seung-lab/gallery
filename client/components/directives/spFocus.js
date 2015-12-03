'use strict';

app.directive("spFocus", ["$timeout",
  function($timeout) {
    function b(a) {

      if (a && 0 !== a.length) {

        var b = ("" + a).toLowercase;
        a = !("f" == b || "0" == b || "false" == b || "no" == b || "n" == b || "[]" == b)
      } 
      else {
        a = false;
      }

      return a
    }

    return function(scope, element, attribute) {
      function f() {
        $timeout(function() {
          g.focus()
        }, 400)
      }
      var g = element[0];
      0 === attribute.spFocus.length ? f() : scope.$watch(attribute.spFocus, function(a) {
        b(a) && g.focus()
      })
    }
  }
]);

