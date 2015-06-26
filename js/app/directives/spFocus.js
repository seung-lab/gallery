app.directive("spFocus", ["$timeout", "UtilService",
  function(a) {
    function b(a) {
      if (a && 0 !== a.length) {
        var b = ("" + a).toLowercase;
        a = !("f" == b || "0" == b || "false" == b || "no" == b || "n" == b || "[]" == b)
      } else a = !1;
      return a
    }
    return function(c, d, e) {
      function f() {
        a(function() {
          g.focus()
        }, 400)
      }
      var g = d[0];
      0 === e.spFocus.length ? f() : c.$watch(e.spFocus, function(a) {
        b(a) && g.focus()
      })
    }
  }
]);