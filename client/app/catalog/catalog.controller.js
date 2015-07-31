'use strict';

(function(app){

	app.controller('CatalogCtrl', ['$scope', 'Cells' , function($scope, Cells) {
			
		console.log('loaded')

		Cells.query(function (cells){
			$scope.cells = cells;

			console.log(cells);
		});


	}]);
	
})(app);