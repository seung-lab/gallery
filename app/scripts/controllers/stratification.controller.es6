'use strict';

app.controller("stratificationController", [ '$q', '$scope', '$state', 'cellService', 'meshService', function ($q, $scope, $state, cellService, meshService) {

	$scope.initChart = function () {
		$scope.neurons = [];
		if ($state.params.neurons) {
			$scope.neurons = $state.params.neurons.split(/ ?, ?/)
				.map( (cellid) => parseInt(cellid, 10) );
		}

		return cellService.get($scope.neurons);
	};

	$scope.onLegendClick = function (cell_id) {
		meshService.toggleVisibility(cell_id);
	};

	$scope.onLegendMouseout = function () {
		for (let id of $scope.neurons) {
			meshService.setOpacity(id, 1.0)
		}
	};

	$scope.onLegendMouseover = function (cell_id) {
		for (let id of $scope.neurons) {
			if (id !== cell_id) {
				meshService.setOpacity(id, 0.25);
			}
			else {
				meshService.setOpacity(id, 1.0);	
			}
		}
	};
}]);

