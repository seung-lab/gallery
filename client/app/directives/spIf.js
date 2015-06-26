app.directive("spIf", function() {
  return {
    transclude: "element",
    priority: 1e3,
    terminal: !0,
    compile: function(a, b, c) {
      return function(a, b, d) {
        var e, f;
        a.$watch(d.spIf, function(d) {
          d ? e || (f = a.$new(), c(f, function(a) {
            e = a, b.after(a)
          })) : e && (e.remove(), f.$destroy(), e = f = void 0)
        })
      }
    }
  }
});