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
				cell.highlight = false;
			};

			scope.mouseleave = function (cell) {
				// timeout necessary to keep multiple events on mouse exit
				// triggering unnecessary renders. It kills the performance.
				$timeout(function () { 
					cell.highlight = false; 
				}, 10);
			};

			scope.mouseenter = function (hovercell) {
				for (let cell of scope.cells) {
					cell.highlight = (cell.id === hovercell.id);
				}
			};

			scope.invert = function (evt) {
				scope.cells.forEach(function (cell) {
					cell.hidden = !cell.hidden;
				});
			};

			scope.restore = function (evt) {
				scope.cells.forEach(function (cell) {
					cell.hidden = false;
				});
			};

			scope.$watch(function (scope) {
				return scope.cells.map( (cell) => cell.hidden ? 't' : 'f' ).join('');
			}, 
			function (value) {
				updateMeshVisibility(scope, scope.cells);
			});

			scope.$watch(function (scope) {
				return scope.cells.map( (cell) => cell.highlight ? 't' : 'f' ).join('');
			}, 
			function (value) {
				updateMeshVisibility(scope, scope.cells);
			});

			function updateMeshVisibility (scope, cells) {
				if (scope.$parent.sidebarFullscreen) {
					return;
				}

				let any = cells.map( (cell) => cell.highlight ).reduce( (a,b) => a || b, false);

				cells.forEach(function (cell) {
					meshService.setVisibility(cell, true);
					meshService.setOpacity(cell, 1.00); 
						
					if (cell.hidden) {
						meshService.setVisibility(cell, false);
					}
					else if (any && !cell.highlight) {
						meshService.setOpacity(cell, 0.25); 
					}
				});

			}
		},
	};
});
	 

