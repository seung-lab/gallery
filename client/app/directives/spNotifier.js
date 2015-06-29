'use strict';

app.directive("spNotifier", ["UtilService", "NotifierFactory", "TransitionerFactory", "$compile", "TouchFactory", "$timeout",
  function(a, b, c, d, e, f) {
    return {
      link: function(g, h) {
        function i(b) {
          function i() {
            m || (m = !0, k.removeClass("tl"), c.after(k, function() {
              k.remove(), n.$destroy(), k = n = null
            }))
          }
          var k, l, m, n = g.$new();
          a.extend(n, b), k = a.element(h.prepend(j).children()[0]), d(k.contents())(n), f(function() {
            k.addClass("tl")
          }), e.tap(k, i), l = f(i, b.delay || 5e3)
        }
        var j = '<div class="notification"><article ng-class="\'icon-\'+icon"><h6>{{name}}</h6><p>{{message}}</p></article></div>';
        b.setCallback(i).get().forEach(i)
      }
    }
  }
]);