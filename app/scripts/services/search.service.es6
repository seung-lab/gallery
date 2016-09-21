'use strict';

// provides searching capabilities for autocomplete
app.factory('searchService', function (cellService) {

	let _this = this;

	this.dataset = [];

	this.setDataset = function (cells) {
		this.dataset = loadAllAutocompletes(cells);
	};

	function normalizeQuery (query = "") {
		return query.toLowerCase().split(/ *[ ,] */g);
	}

	this.firstResults = function (query = "") {
		let cellids = [];

		normalizeQuery(query).forEach(function (subquery) {
			let results = _this.search(subquery);
			cellids = cellids.concat([...(results[0].value)]);     
		});

		return _.uniq(cellids);
	}

	this.search = function (query) {
		query = query || "";
		query = normalizeQuery(query);
		query = query[query.length - 1];

		if (!query) {
			return _this.dataset;
		}

		let regquery = query.replace(/[^\w\d]/g, '');
		let prefix_regexp = new RegExp(`^${regquery}`, 'i');
		let substring_regexp = new RegExp(`${regquery}`, 'i');

		let metric = _this.dataset.map(function (state) {
			return [ 
				state, 
				state.display.match(prefix_regexp) ? -1 : 0, // prefix comes first e.g. 4 matches 4ow before 3i
				state.display.match(substring_regexp) ? -1 : 0, // substrings e.g. SAC matches OFF SAC before random stuff
				levenshteinDistance(query, state.display.toLowerCase()), // similar matches from edit distance
				state.display.toLowerCase() // then by alphabetical order
			];
		});

		metric.sort(function (a,b) {
			return (a[1] - b[1]) || (a[2] - b[2]) || (a[3] - b[3]) || a[4].localeCompare(b[4]);
		});

		return metric.map( (state_score) => state_score[0] );
	}

	/* Modified from https://gist.github.com/andrei-m/982927

		Copyright (c) 2011 Andrei Mackenzie

		Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	*/

	// Compute the edit distance between the two given strings
	function levenshteinDistance (a, b) {
		if (a.length == 0) return b.length; 
		if (b.length == 0) return a.length; 

		var matrix = new Array(b.length + 1);

		// increment along the first column of each row
		for (var i = 0; i <= b.length; i++) {
			matrix[i] = new Array(a.length + 1);
			matrix[i][0] = i;
		}

		// increment each column in the first row
		for (var j = 0; j <= a.length; j++) {
			matrix[0][j] = j;
		}

		// Fill in the rest of the matrix
		for (i = 1; i <= b.length; i++) {
			for (j = 1; j <= a.length; j++) {
				if (b.charAt(i-1) == a.charAt(j-1)) {
					matrix[i][j] = matrix[i-1][j-1];
				} 
				else {
					matrix[i][j] = Math.min(
						matrix[i-1][j-1] + 1, // substitution
						Math.min(
							matrix[i][j-1] + 1, // insertion
							matrix[i-1][j] + 1  // deletion
					)); 
				}
			}
		}

		return matrix[b.length][a.length];
	};


	/*
	 * Build `states` list of key/value pairs
	 */
	function loadAllAutocompletes (cellinfos) {
		let cells = {};

		function addInfo (cell, attr) {
			if (cell[attr] === undefined) {
				return;
			}

			cells[cell[attr]] = cells[cell[attr]] || {
				display: cell[attr] || "null",
				value: new Set(),
				count: 0,
			};

			cells[cell[attr]].value.add(cell.id);
		}


		for (let cell of cellinfos) {
			addInfo(cell, 'id');
			addInfo(cell, 'name');
			addInfo(cell, 'description');
			addInfo(cell, 'type');
		}

		return Object.keys(cells).map( (key) => { 
			let item = cells[key];
			item.count = [...item.value].length;

			return item;
		});
	}

	return this;
});