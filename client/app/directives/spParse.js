'use strict';

app.directive("spParse", ["TouchFactory", "UtilService",
  function() {
    return function(a, b, c) {
      var d = a.$eval(c.spParse),
      e = b.find("div"),
      f = b.find("textarea"),
      g = function() {
        var a = f.val();
        e.html(d(a) || "")
      };
      f.bind("keyup", g)
    }
  }
]);