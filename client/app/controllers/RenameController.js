'use strict';

( function (app) {

app.controller("RenameController", ["$scope", "$rootScope",
  function($scope, $rootScope) {
      var sets = $rootScope.sets;
      $scope.renameSet = function(a, b) {
          var d = sets[a];
          return b !== d.name ? (d.name = b, sets.save(d)) : !1
      }
  }
]);

})(app);