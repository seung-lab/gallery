
app.directive('card', function ($mdDialog, $state) {
	'use strict';

	function link ($scope, element, attrs) {
		$scope.view = function () {
			$state.go('viewer', { 
				neurons: $scope.set.neurons.join(","),
			});
		};

		$scope.showWikiDialog = function (ev, locals) {
			window.location = 'wiki.eyewire.org/index.php?title=' + locals.wiki;
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
			set: '=setData',
		},
		link: link,
	};
});