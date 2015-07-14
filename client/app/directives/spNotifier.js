'use strict';

app.directive("spNotifier", ["UtilService", "NotifierFactory", "TransitionerFactory", "$compile", "TouchFactory", "$timeout",
  function(UtilService, NotifierFactory, TransitionerFactory, $compile, TouchFactory, $timeout) {
    return {
      link: function(scope, elements) {
        function i(b) {


          function callback() {
            m || (m = !0, k.removeClass("tl"), TransitionerFactory.after(k, function() {
              k.remove(), newScope.$destroy(), k = newScope = null
            }))
          }
          var k, l, m, newScope = scope.$new();

          UtilService.extend(newScope, b);

          var div = '<div class="notification"><article ng-class="\'icon-\'+icon"><h6>{{name}}</h6><p>{{message}}</p></article></div>';

          k = UtilService.element(elements.prepend(div).children()[0]);
          $compile(k.contents())(newScope);

          $timeout(function() {
            k.addClass("tl")
          });

          TouchFactory.tap(k, callback);
          l = $timeout(callback, b.delay || 5e3)
        }
        NotifierFactory.setCallback(i).get().forEach(i)
      }
    }
  }
]);