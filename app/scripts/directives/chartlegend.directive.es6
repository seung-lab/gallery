'use strict';
	
app.directive('chartlegend', 
	function ($q, $timeout, mesh, cells) {

	return {
		restrict: "E",
		scope: true,
		templateUrl: "templates/chartlegend.html",
		replace: false,
		transclude: false,
		link: function (scope, element, attrs) {
			scope.cells = [];

			cells.get(scope.$parent.neurons).then(function (cellobjs) {
				scope.cells = cellobjs;
			});

			scope.click = function (cell) {
				cell.hidden = !cell.hidden;
				mesh.toggleVisibility(cell.id);
			};

			scope.mouseleave = function (cell) {
				for (let cell of scope.cells) {
					mesh.setOpacity(cell.id, 1.0)
				}
			};

			scope.mouseenter = function (clickcell) {
				for (let cell of scope.cells) {
					if (cell.id !== clickcell.id) {
						mesh.setOpacity(cell.id, 0.25);
					}
					else {
						mesh.setOpacity(cell.id, 1.0); 
					}
				}
			};
		},
	};
});
	 

