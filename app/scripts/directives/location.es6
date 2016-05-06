
app.directive('ngLocation', [ "$location", function ($location) {
  return {
    restrict: "A",
    link: function (scope, element, attrs) {
    	element.on('click', function () {
    		window.location = attrs.ngLocation;	
    	});
    },
  };
}]);
