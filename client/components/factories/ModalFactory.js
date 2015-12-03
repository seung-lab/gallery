'use strict';

(function (){
app.factory("ModalFactory", ["$rootScope", "$location", "$routeParams", "TransitionerFactory", "$timeout",
  function($rootScope, $location, $routeParams, transitioner, $timeout) {
    function search(path) {
      $location.search("modal", path || null)
    }

    var modal = function(path) {

      if ($rootScope.modalClass) {

        $rootScope.modalClass = "";

        transitioner.apply("modal", function() {
          search();
          
          if( path != $routeParams.modal ){
            $timeout(function() {
                search(path);
            });
          }
         
        });
        return
      }
      else {
        search(path);
        return true;
      }
    };

    modal.isOn = function(b) {
      return b ? $rootScope.modalClass === b : $rootScope.modalClass
    }

    return modal;
  }
]);
})();