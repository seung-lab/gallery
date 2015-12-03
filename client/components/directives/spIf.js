'use strict';

app.directive("spIf", function() {
  return {
    transclude: "element",
    priority: 1e3,
    terminal: true,
    compile: function(tElement, tAttrs, transclude) {

      return function(scope, iElement, iAttrs) {
        var transclue_content, child_scope;

        scope.$watch(iAttrs.spIf, function(iAttrs) {

          if (iAttrs) {
            child_scope = scope.$new();
            
            transclude(child_scope, function(content) {
              transclue_content = content;
              iElement.after(content);
            });

            return;
          }

          if ( transclue_content ){
            transclue_content.remove(); 
            child_scope.$destroy();
            transclue_content = undefined;
            child_scope = undefined;
          }
          


        });
      };
    }
  }
});