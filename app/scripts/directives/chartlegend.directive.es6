'use strict';
	
app.directive('chartlegend', 
	function ($q, $timeout, meshService, cellService) {

	return {
		restrict: "E",
		scope: true,
		templateUrl: "templates/chartlegend.html",
		replace: false,
		transclude: false,
		link: function (scope, element, attrs) {
			scope.cells = [];

			cellService.get(scope.$parent.neurons).then(function (cellobjs) {
				scope.cells = cellobjs;
			});

			scope.click = function (cell) {
				cell.hidden = !cell.hidden;
				meshService.toggleVisibility(cell);
			};

			scope.mouseleave = function (cell) {
				for (let cell of scope.cells) {
					meshService.setOpacity(cell, 1.0)
				}
			};

			scope.mouseenter = function (clickcell) {
				for (let cell of scope.cells) {
					if (cell.id !== clickcell.id) {
						meshService.setOpacity(cell, 0.25);
					}
					else {
						meshService.setOpacity(cell, 1.0); 
					}
				}
			};
		},
	};
});
	 

