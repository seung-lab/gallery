'use strict';
  
app.directive('advancedsearch', [ function () {

	function linker (scope, element, attrs) {
		scope.filters = {	
			cell_types: {},
			coarse_depth: {},
			depth_range: {},
			fine_depth: {},
			tangential_size: {},
		};

		scope.results = [];

		scope.$watch(function (scope) {
			return Object.keys(scope.filters).map(function (fltr) {
				let activations = scope.filters[fltr];
				return Object.keys(activations).map( 
					(item) => activations[item] ? item : '' 
				).join(',')
			}).join(';');
		}, function () {
			scope.results = applyFilters(scope.states, scope.filters);
		});
	}

	function applyFilters (states, filters) {
		

		return [];
	}

	return {
		restrict: "E",
		scope: {
			states: "=",
		},
		templateUrl: "templates/advancedsearch.html",
		replace: false,
		transclude: false,
		link: linker,
	  };
}]);
   

