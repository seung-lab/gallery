'use strict';

(function(app){

	app.controller('SetsCtrl', ['$rootScope', '$scope' , 'Sets' , '$location' , function($rootScope , $scope, Sets, $location) {
		

		function getChildren() {
			var children = {};

			for ( var i = 0; i < $scope.set.children.length ; ++i) {

				var id = $scope.set.children[i];
				
				(function(id){

					Sets.get ({ id: id }, function(set) {
						children[id] = set;
					});
					
				})(id);

	
			}

			return children;

		}
		$scope.children = getChildren();



	  $scope.parentPath = function() {

      $rootScope.viewSlide.to = 'right';
      $rootScope.viewSlide.force = true;    
      $location.path( 'set/' +_.dropRight($scope.setIds).join('/') );

    };

    $scope.childPath = function(childId) {

      $rootScope.viewSlide.to = 'left';
      $rootScope.viewSlide.force = true;    
      $location.path( 'set/'+ $scope.setIds.concat(childId).join('/') );

      console.log('set/'+ $scope.setIds.concat(childId).join('/'));

    };

	}]);
	
})(app);