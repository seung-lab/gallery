'use strict';

app.controller("stratificationController", [ '$q', '$scope', '$state', 'cells', 'mesh', function ($q, $scope, $state, cells, mesh) {

	$scope.initChart = function () {
		$scope.neurons = [];
		if ($state.params.neurons) {
			$scope.neurons = $state.params.neurons.split(/ ?, ?/)
				.map( (cellid) => parseInt(cellid, 10) );
		}

		
		let promises = [];

		for (let cell_id of $scope.neurons) {
			promises.push(cells.show(cell_id));
		}

		return $q.all(promises);
	};

	$scope.onLegendClick = function (cell_id) {
		mesh.toggleVisibility(cell_id);
	};

	$scope.onLegendMouseout = function () {
		for (let id of $scope.neurons) {
			mesh.setOpacity(id, 1.0)
		}
	};

	$scope.onLegendMouseover = function (cell_id) {
		for (let id of $scope.neurons) {
			if (id !== cell_id) {
				mesh.setOpacity(id, 0.25);
			}
			else {
				mesh.setOpacity(id, 1.0);	
			}
		}
	};
}]);

