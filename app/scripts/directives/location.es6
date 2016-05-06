
app.directive('ngLocation', [ "$state", function ($state) {
  return {
    restrict: "A",
    link: function (scope, element, attrs) {
    	element.on('click', function () {
    		try {
	    		$state.go(attrs.ngLocation);	
	    	}
	    	catch (e) {
	    		window.location = attrs.ngLocation;
	    	}
    	});
    },
  };
}]);
