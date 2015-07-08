'use strict';

(function (app) {

app.controller("AddController", ["$scope", "$routeParams", "$rootScope",
  function($scope, $routeParams, $rootScope) {
    var sets = $rootScope.sets;
   
    $scope.addNew = function(name) {

      if (!$routeParams.cellId){

        //Create empty set
        return sets.save({
          name: name
        });

      }

      var cellId = parseInt($routeParams.cellId);

      return sets.save({
        name: name,
        children_are_cells: true,
        children: [ cellId ]
      });
    };

    $scope.addExisting = function(setId) {

      var cellId = parseInt($routeParams.cellId);
      var set = sets.get(setId);

      if (set.children.indexOf(cellId) !== -1) {
        // TODO display an error message?
        return true;
      } 
      else {
        set.children.push(cellId);
        return true;
      }
    }
  }
]);
})(app);