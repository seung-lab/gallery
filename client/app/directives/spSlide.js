app.directive("spSlide", ["UtilService", "TransitionerFactory", function(util, transitioner) {
  return {
    transclude: "element",
    priority: 1e3,
    terminal: true,
    compile: function(a, c, d) {
      return function(a, e) {
        var f, g, h;
        var i = c.spSlide;
        var j = e.parent();
        j.addClass("t3d");
        a.$watch(function(a) {
          var c;
          var k = a.$eval(i);
          !k.model && h && (g.remove(), f.$destroy(), g = f = h = null), k.model && (k.model != h || k.force) && (k.force = !1, c = a.$new(), c.model = k.model , d(c, function(a) {
            if (e.after(a), g) {
              var d = g,
              i = f;
              "left" == k.to ? (a.addClass("tr"), j.addClass("transition tl")) : (a.addClass("tl"), j.addClass("transition tr")), g.bind("$destroy", function() {
                j.removeClass("transition tl tr"), a.removeClass("tr tl")
              });
              transitioner.apply(j[0].id, function() {
                d.remove(), i.$destroy()
              })
            }
            g = a;
            f = c;
            h = k.model;
          }))
        })
      }
    }
  }
}]);