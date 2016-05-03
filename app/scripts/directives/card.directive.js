
app.directive('card', function ($mdDialog, $state) {
	'use strict';

	function getImagePath () {
		var pattern = new Trianglify({
			width: 300,
			height: 200,
		});

		return pattern.png();
	}

	function link ($scope, element, attrs) {
		$scope.imagePath = getImagePath();

		$scope.view = function () {
			$state.go('viewer', { neurons: $scope.set.neurons });
		};

		$scope.showWikiDialog = function (ev, locals) {
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'app/templates/wiki-dialog.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
				locals: locals,
			});
		};

		function DialogController ($scope, $mdDialog, $sce, name, wiki) {
			
			$scope.trustSrc = (src) => $sce.trustAsResourceUrl(src);

			$scope.name = name;
			$scope.wiki = wiki + '&printable=yes';

			$scope.cancel = function () {
				$mdDialog.cancel();
			};
		}
	}
  
	return {
		restrict: 'E',
		transclude: false,
		templateUrl: 'templates/card.html',
		scope: {
			set: '=setData'
		},
		link: link
	};
});