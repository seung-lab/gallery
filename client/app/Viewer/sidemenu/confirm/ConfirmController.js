'use strict';

(function (app) {
  
app.controller("ConfirmController", ["$scope", "$routeParams", "$rootScope", "UtilService", "$location",
  function($scope, $routeParams, $rootScope, UtilService, $location) {
      var sets = $rootScope.sets,
      cells = $rootScope.cells;

      $scope.trashcell = function() {
          var a = $routeParams.cellId,
          c = $routeParams.setId;
          $location.path((c ? "set" : $routeParams.view) + "/" + (sets[c] ? c + "/" : ""));
          cells.remove(a);
          return sets.forEach(function(set) {
              UtilService.unlist(set.children, a) || sets.remove(set.id)
          });
      }
  }
]);
})(app);