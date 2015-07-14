'use strict';

app.directive("spIf", function() {
  return {
    transclude: "element",
    priority: 1e3,
    terminal: true,
    compile: function(scope, elements, transclude) {

      return function(scope, elements, transclude) {
        var e, f;
        scope.$watch(transclude.spIf, function(d) {
          d ? e || (f = scope.$new(), c(f, function(a) {
            e = a, elements.after(a)
          })) : e && (e.remove(), f.$destroy(), e = f = void 0)
        })
      }
    }
  }
});