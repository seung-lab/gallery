'use strict';

( function (app) {

app.directive("spTap", ["TouchFactory", "KeyboardFactory",
  function(touch, keyboard) {
    return function(scope, element, attribute) {

      touch.tap(element, function() {
        return scope.$apply(attribute.spTap)
      });

      if (attribute.spKbd) {
        keyboard.on(scope.$eval(attribute.spKbd), function() {
          return scope.$apply(attribute.spTap);
        });
      }
    }
  }
]);

})(app);