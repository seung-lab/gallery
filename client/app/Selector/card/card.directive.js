
	app.directive('card', function($mdDialog, $state) {
	'use strict';

  // var Trianglify = require('../../bower_components/trianglify/lib/trianglify.js');
  function getImagePath() {
 		var pattern = new Trianglify({
            width: 300,
            height: 200
        });

    return pattern.png();
	}

	function link(scope, element, attrs) {
	   
	  scope.imagePath = getImagePath();
    console.log(attrs);

	  scope.view = function() {
	  	$state.go('/set/'+scope.set.id);
	  };

	  scope.showWikiDialog = function(ev, locals) {

      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'app/Selector/wiki-dialog/wiki-dialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        locals:locals
      });
    };



	  function DialogController($scope, $mdDialog, $sce,  name, wiki ) {

      $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
      };

      $scope.name = name;
      $scope.wiki = wiki+'&printable=yes';

      $scope.cancel = function() {
        $mdDialog.cancel();
      };
    }

	}
  
  return {
    restrict: 'E',
    transclude: false,
    templateUrl: 'app/Selector/card/card.html',
    scope:{
    	set: '=setData'
    },
    link:link
  };
});