'use strict';

( function (app) {

app.controller("NewController", ["$scope",
  function($scope) {

    function newCell(cell) {
      
      if ($scope.set.children.indexOf(cell.id) != -1){
        return false;
      }

      
      $scope.set.children.push(cell.id);
      $scope.set.$update();

      return true;
    }



    function newSet (name, children_are_cells) {

      $scope.sets.save({
          name: name,
          children_are_cells: children_are_cells,
          children : []
      }, function ( childId ) {

        $scope.set.children.push(childId);
        $scope.set.$update();
      });

      return true;
    }

    $scope.newSet = newSet;
    $scope.newCell = newCell;

}]);

})(app);