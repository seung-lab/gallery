'use strict';
  
app.directive('multiselect', [ function () {

	function linker (scope, element, attrs) {
		scope.$watch(function (scope) {
			return Object.keys(scope.selection).map( 
				(opt) => scope.selection[opt] 
			).join(",");
		});

		scope.mousedown = false;
		scope.movement = true;
	}

	return {
		restrict: "E",
		scope: {
			options: "=",
			title: "@",
			selection: "=",
		},
		template: `<div class="multiselect">
			<div class="title">{{title}}</div>
			<div class="options"
				ng-mousedown="mousedown = true"
				ng-mouseup="mousedown = false"
				ng-mouseleave="mousedown = false"
			>
				<div 
					ng-repeat="option in options"
					ng-mousedown="$parent.movement = selection[option] = !selection[option]"
					ng-mouseover="selection[option] = $parent.mousedown ? $parent.movement : selection[option]"
					ng-class="{ option: true, selected: selection[option] }"
				>{{option}}</div>
			</div>
		</div>`,
		replace: false,
		transclude: false,
		link: linker,
	  };
}]);
   

