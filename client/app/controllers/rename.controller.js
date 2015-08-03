'use strict';

( function (app) {

app.controller("RenameCtrl", ["$scope",
  function($scope) {
 	
	 	function renameSet( newName ) {

	 		$scope.set.name = newName;
	 		$scope.set.$update();

	 		return true;
	 	}


	 	$scope.renameSet = renameSet;
  }
]);

})(app);