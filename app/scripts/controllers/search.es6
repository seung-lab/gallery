'use strict';

app.controller('SearchController', function ($scope, $timeout, $state, cellService) {

	let self = this;

	$scope.txt = '';
	$scope.data = {
		show_bipolars: true,
		show_ganglia: true,
		show_amacrine: true,
	};

	$scope.cells = []; // { $celltype: [ ... cells ... ] }

	$scope.$watch( (scope) => $scope.cells, function () {
		self.states = loadAllAutocompletes();
	});

	let loaded = cellService.list()
		.then(function (cellinfos) {
			$scope.cells = cellinfos;
			return cellinfos;
		})
		.then(function (cellinfos) {
			generateCards();
			return cellinfos;
		})

	/*
	 * Build `states` list of key/value pairs
	 */
	function loadAllAutocompletes () {
		let choices = [];

		for (let cell of $scope.cells) {
			choices.push(
				cell.name,
				cell.description,
				cell.type,
				cell.id
			);
		}

		choices = _.uniq(choices).filter( (x) => x !== undefined ); 
		choices.sort();
	 
		return choices.map(function (state) {
			if (!state) {
				return {
					value: null,
					display: "null",
				};
			}

			return {
				value: state.toLowerCase(),
				display: state || "null",
			};
		})
	}

	/**
	 * Populates the autocomplete list shown
	 */
	function querySearch (query) {
		query = query || "";
		query = query.toLowerCase();

		let results = query 
			? self.states.filter(function (state) {
					return state.value.toLowerCase().indexOf(query) > -1;
				})
			: self.states;

		return results;
	}

	function search (text) {
		let base_cards = baseCards();

		if (!text.length) {
			return base_cards;
		}

		let cards = [];

		let queryText = text.toLowerCase();
		for (let i = 0; i < base_cards.length; i++) {
			let card = base_cards[i];
			 	
			if (card.name.toLowerCase().indexOf(queryText) > -1
				|| card.neurons.indexOf(queryText) > -1
				|| card.description.toLowerCase().indexOf(queryText) > -1) {

				cards.push(base_cards[i]);
			}
		}

		return cards;
	}

	function searchTextChange (text) {
		text = text || "";
		$scope.txt = text.toLowerCase();
		
		generateCards();
	}

	function selectedItemChange (item) {
		$scope.txt = item 
			? item.value.toLowerCase()
			: "";

		generateCards();
	}

	function baseCards () {
		let cells = $scope.cells.filter(function (cell) {
			return (
				$scope.data.show_ganglia 
				&& cell.type === 'ganglion'
			) || (
				$scope.data.show_bipolars
				&& cell.type === 'bipolar'
			) || (
				$scope.data.show_amacrine
				&& cell.type === 'amacrine'
			);
		});

		let cards = {};
		for (let cell of cells) {
			cards[cell.name] = cards[cell.name] || {
				name: cell.name,
				description: cell.annotation,
				type: cell.type,
				neurons: [],
			};
			cards[cell.name].neurons.push(cell.id);
		}

		return Object.keys(cards).map((name) => cards[name]);
	}

	function generateCards () {
		if ($scope.txt) {
			$scope.cards = search($scope.txt);	
		}
		else {
			$scope.cards = baseCards();
		}
	}

	$scope.$watch( (scope) => scope.data.show_ganglia, function () {
		generateCards();
	});

	$scope.$watch( (scope) => scope.data.show_bipolars, function () {
		generateCards();
	});

	$scope.$watch( (scope) => scope.data.show_amacrine, function () {
		generateCards();
	});

	$scope.isDisabled = false;
	$scope.querySearch = querySearch;
	$scope.selectedItemChange = selectedItemChange;
	$scope.searchTextChange = searchTextChange;
});








