(function (){
app.factory("ModalFactory", ["$rootScope", "$location", "$routeParams", "TransitionerFactory", "$timeout",
  function($rootScope, $location, $routeParams, transitioner, $timeout) {
    function f(a) {
      $location.search("ModalFactory", a || null)
    }
    var g = function(b) {
      return $rootScope.modalClass ? ($rootScope.modalClass = "", transitioner.apply("ModalFactory", function() {
        f(), b != $routeParams.modal && $timeout(function() {
          f(b)
        })
      })) : b && f(b), !0
    };

    return g.isOn = function(b) {
      return b ? $rootScope.modalClass === b : $rootScope.modalClass
    }, g
  }
})();