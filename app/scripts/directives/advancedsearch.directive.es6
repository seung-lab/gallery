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
   

