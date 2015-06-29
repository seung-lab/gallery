'use strict';

app.directive("spTap", ["TouchFactory", "KeyboardFactory",
  function(touch, keyboard) {
    return function(c, d, e) {
      touch.tap(d, function() {
        return c.$apply(e.spTap)
      });

      e.spKbd && keyboard.on(c.$eval(e.spKbd), function() {
        return c.$apply(e.spTap)
      })
    }
  }
]);
