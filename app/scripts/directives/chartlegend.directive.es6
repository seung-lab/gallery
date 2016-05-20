'use strict';
	
app.directive('chartlegend', 
	function ($q, $timeout, meshService, cellService) {

	return {
		restrict: "E",
		scope: {
			cells: "=",
		},
		templateUrl: "templates/chartlegend.html",
		replace: false,
		transclude: false,
		link: function (scope, element, attrs) {

			scope.click = function (cell) {
				cell.hidden = !cell.hidden;
				meshService.toggleVisibility(cell);
			};

			scope.mouseleave = function (cell) {
				cell.highlight = false; 

				for (let cell of scope.cells) {
					meshService.setOpacity(cell, 1.0)
				}
			};

			scope.mouseenter = function (hovercell) {
				for (let cell of scope.cells) {
					if (cell.id !== hovercell.id) {
						cell.highlight = false;
						meshService.setOpacity(cell, 0.25);
					}
					else {
						cell.highlight = true;
						meshService.setOpacity(cell, 1.00); 
					}
				}
			};
		},
	};
});
	 

