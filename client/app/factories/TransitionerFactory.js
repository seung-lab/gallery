'use strict';

( function (){
app.factory("TransitionerFactory", ["$rootScope", "$document", "UtilService",
  function(a, b, c) {
    function d() {
      var a, c = b[0].createElement("dummy"),
      d = {
        transition: "transitionend",
        OTransition: "oTransitionEnd",
        MSTransition: "msTransitionEnd",
        MozTransition: "transitionend",
        WebkitTransition: "webkitTransitionEnd"
      };
      for (a in d)
        if (void 0 !== c.style[a]) return d[a]
      }
    var e = d(),
    f = {}, g = [];
    return e && b.bind(e, function(b) {
      var c = b.target.id;
      if (c && c in f) {
        for (; f[c].length;) a.$apply(f[c].shift());
          delete f[c]
      }
    }), {
      apply: function(a, b, c) {
        return e ? (a in f && !c || (f[a] = []), void f[a].push(b)) : void b()
      },
      after: function(a, b, d) {
        a[0] && (a = a[0]), a.id || (a.id = c.generateId()), this.apply(a.id || g.push(a) - 1, b, d)
      }
    }
  }
]);
})();