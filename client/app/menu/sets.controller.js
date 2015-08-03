'use strict';

( function (app) {

app.controller("SetsCtrl", ["$scope",
  function($scope) {

  	function removeSet( index ) {
  		
  		var childToRemove = $scope.set.children[index]
  		$scope.sets.get(childToRemove).$delete();


  		$scope.set.children.splice(index, 1);
  		console.log($scope.set.children)
  		$scope.set.$update();


   	}

  	$scope.removeSet = removeSet;
    
}]);

})(app);