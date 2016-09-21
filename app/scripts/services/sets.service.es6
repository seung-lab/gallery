'use strict';
 
/**
 * Using Rails-like standard naming convention for endpoints.
 * GET		 /1.0/sets							->	list
 * POST		/1.0/sets							->	create
 * GET		 /1.0/sets/:id					->	show
 * PUT		 /1.0/sets/:id					->	update
 * DELETE	/1.0/sets/:id					->	destroy
 */

app.service('cellSetsService', [ '$q', '$resource', function ($q, $resource) {
	let _this = this;

	let CellSets = $resource('/1.0/sets/', {}, {
		query: { 
			method: 'GET', 
			isArray: true, 
			cache: true, 
		},
	});
	let CellSet = $resource('/1.0/sets/:type', '@type');
	let CellSetPreview = $resource('/1.0/sets/:type/preview', { type: '@type' }, {
		get: {
			method: 'GET',
			responseType: 'arraybuffer',
			cache: true,
			transformResponse: function (data, headersGetter) {
				let blob = new Blob([data], { type: 'image/png' });
				return { url: URL.createObjectURL(blob) };
			},
		},
	});
 
	this.query = CellSets.query;
	this.preview = function (type, fn) {
		return CellSetPreview.get({ type: type }, fn);
	};

	this.classicalTypeToHtml = function (type) {
		return (type || "")
              .replace(/-alpha$/, 'α')
              .replace(/\^(\w+)\b/, '<sup>$1</sup>');
	};
	
	return this;
}]);