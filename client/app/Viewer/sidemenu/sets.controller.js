'use strict';

( function (app) {

app.controller("SetsCtrl", ["$scope",
  function($scope) {

  	function removeSet( index ) {
  		
  		var childToRemove = $scope.set.children[index]
  		$scope.sets.get(childToRemove).$delete();


  		$scope.set.children.splice(index, 1);
  		$scope.set.$update();

   	}

   	function trashSet() {

   		var parentId = $scope.setIds[ $scope.setIds.length - 2]	
   		var parentSet = $scope.sets.get( parentId );
   		var index = parentSet.children.indexOf( $scope.set.id);
   		parentSet.children.splice(index, 1);
   		parentSet.$update();
   		$scope.set.$delete();


   		$scope.parentPath();
   	}

  	$scope.removeSet = removeSet;
    $scope.trashSet = trashSet;
}]);

})(app);