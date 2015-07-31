'use strict';

( function (app) {

app.controller("NewController", ["$scope",
  function($scope) {

      $scope.newCell = function(cell) {
        
        if (cell.id in $scope.set.children){
          return false;
        }

        
        $scope.set.children.push(cell.id);
        $scope.sets.addChild( $scope.set.id , cell.id);
        return true;
      }



    function newSet (name, children_are_cells) {

      $scope.sets.save({
          name: name,
          children_are_cells: children_are_cells,
          children : []
      }, function ( childId ) {

        $scope.set.children.push(childId);

        $scope.sets.addChild( $scope.set.id , childId);
      });

      return true;
    }

    $scope.newSet = newSet;

}]);

})(app);