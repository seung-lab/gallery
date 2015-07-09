'use strict';

app.directive("spSlide", ["UtilService", "TransitionerFactory", function(util, transitioner) {
  return {
    transclude: "element",  
    priority: 1e3,
    terminal: true,
    compile: function(element, attributes, transclude) {

      return function(telement, tattribute) {
  
       function listener ( viewSlide ){

          if(!viewSlide.model){
            oldViewElement.remove();
            oldInheritedScope.$destroy();
            oldViewElement = oldInheritedScope = oldModel = null;
            return;
          }  

          if  ( viewSlide.model != oldModel || viewSlide.force ) {

            viewSlide.force = false;

            var inheritedScope = scope.$new();
            inheritedScope.model = viewSlide.model;

            transclude(inheritedScope, function(viewElement) {
              
              tattribute.after(viewElement);
              
              if (oldViewElement) {
            
                if ("left" == viewSlide.to ) {
                  viewElement.addClass("tr");
                  parent.addClass("transition tl");
                }
                else {
                  viewElement.addClass("tl"); 
                  parent.addClass("transition tr");
                }


                oldViewElement.bind("$destroy", function() {
                  parent.removeClass("transition tl tr");
                  viewElement.removeClass("tr tl");
                });

                var d = oldViewElement;
                var i = oldInheritedScope;
                transitioner.apply(parent[0].id, function() {
                  d.remove();
                  i.$destroy();
                })
              }

              oldViewElement = viewElement;
              oldInheritedScope = inheritedScope;
              oldModel = viewSlide.model;
            });
          }        
        }



        var oldInheritedScope, oldViewElement, oldModel;
        var spSlide = attributes.spSlide;
        var parent = tattribute.parent();
        parent.addClass("t3d");

        telement.$watch( function(scope){ return scope.viewSlide; } , listener , true);
      };
    }
  }
}]);