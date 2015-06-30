'use strict';

(function (app) {

app.controller("AddController", ["$scope", "$routeParams", "$rootScope",
  function($scope, $routeParams, $rootScope) {
    var sets = $rootScope.sets;
    

    $scope.addNew = function(name) {

      return sets.save({
        name: name,
        cells: [{
            id: $routeParams.cellId
        }]
      });
    };

    $scope.addExisting = function(setId) {
      var cellId = $routeParams.cellId,
      set = sets[setId];

      return set.children[cellId] ? true : (set.children.push(set.children[cellId] = {
          id: cellId
      }), sets.save(set))
    }
  }
]);
})(app);