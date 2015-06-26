(function () {
app.controller("AddController", ["$scope", "$routeParams", "$rootScope",
  function($scope, $routeParams, $rootScope) {
      {
          var sets = $rootScope.sets;
      }
      $scope.s = sets.filter(function(a) {
          return sets.isWriter(a)
      });
      $scope.addNew = function(name) {

          return sets.save({
              name: name,
              cells: [{
                  _id: $routeParams.cellId
              }]
          })
      };

      $scope.addExisting = function(a) {
          var cellId = $routeParams.cellId,
          set = sets[a];

          return set.cells[cellId] ? true : (set.cells.push(set.cells[cellId] = {
              _id: cellId
          }), sets.save(set))
      }
  }
]);
})();