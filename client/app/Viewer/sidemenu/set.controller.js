'use strict';

( function (app) {

app.controller("SetCtrl", ["$scope",
  function($scope) {
	
	function removeCell( index ) {
		
		var cellId = $scope.set.children.splice(index, 1);
		
		$scope.toggleActive(cellId)

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

	$scope.removeCell = removeCell;
	$scope.trashSet = trashSet;
}]);

})(app);