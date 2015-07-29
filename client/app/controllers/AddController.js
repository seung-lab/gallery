'use strict';

(function (app) {

app.controller("AddController", ["$scope", "$routeParams", "$rootScope",
  function($scope, $routeParams, $rootScope) {
    var sets = $rootScope.sets;
   
    $scope.addNew = function(name) {

      if (!$routeParams.cellId) {  //Create empty set

        var id = sets.save({
          name: name,
          children : []
        });

        $rootScope.set.children.push(id);

        return id;
      }

      var cellId = parseInt($routeParams.cellId);

      var id = sets.save({
        name: name,
        children_are_cells: true,
        children: [ cellId ]
      });

      sets.get(0).children.push(id);

      return id;  
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