'use strict';

app.directive("spNotifier", ["UtilService", "NotifierFactory", "TransitionerFactory", "$compile", "TouchFactory", "$timeout",
  function(UtilService, NotifierFactory, TransitionerFactory, $compile, TouchFactory, $timeout) {
    return {
      link: function(g, h) {
        function i(b) {
          function i() {
            m || (m = !0, k.removeClass("tl"), TransitionerFactory.after(k, function() {
              k.remove(), n.$destroy(), k = n = null
            }))
          }
          var k, l, m, n = g.$new();
          UtilService.extend(n, b), k = UtilService.element(h.prepend(j).children()[0]), $compile(k.contents())(n), $timeout(function() {
            k.addClass("tl")
          }), TouchFactory.tap(k, i), l = $timeout(i, b.delay || 5e3)
        }
        var j = '<div class="notification"><article ng-class="\'icon-\'+icon"><h6>{{name}}</h6><p>{{message}}</p></article></div>';
        NotifierFactory.setCallback(i).get().forEach(i)
      }
    }
  }
]);