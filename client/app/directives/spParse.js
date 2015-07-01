'use strict';

app.directive("spParse", ["TouchFactory", "UtilService",
  function() {
    return function(scope, element, attribute) {
      var d = scope.$eval(attribute.spParse),
      e = element.find("div"),
      f = element.find("textarea"),
      g = function() {
        var a = f.val();
        e.html(d(a) || "")
      };
      f.bind("keyup", g)
    }
  }
]);