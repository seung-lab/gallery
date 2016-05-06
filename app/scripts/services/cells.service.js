'use strict';
 
/**
 * Using Rails-like standard naming convention for endpoints.
 * GET		 /cells							->	index
 * POST		/cells							->	create
 * GET		 /cells/:id					->	show
 * PUT		 /cells/:id					->	update
 * DELETE	/cells/:id					->	destroy
 */

app.service('cells', [ '$q', '$resource', function ($q, $resource) {
	var api = $resource('/1.0/cells/:id', { id: '@_id' }, { 
		index: { 
			method: 'GET', 
			isArray: true, 
			cache: true, 
		},
		create: { method: 'POST' }, // isn't this backwards with update?
		show: { 
			method: 'GET', 
			isArray: false, 
			cache: true, 
		},
		update: { method: 'PUT', },
		destroy: { method: 'DELETE' },
	});

	this.show = function (cell_id, callback) {
		return $q(function (resolve, reject) {
			api.show({ id: cell_id }, function (cell) {
				cell.color = getColor(cell.id);
				
				resolve(cell);

				if (callback) {
					callback(cell);
				}
			});
		});
	};

	this.index = function (callback) {
		api.index(callback);	
	};

	this.create = api.create;

	function getColor (i) {

		// From https://en.wikipedia.org/wiki/Help:Distinguishable_colors

		var colors = [
			'#F0A3FF', '#0075DC', '#993F00', '#4C005C', '#005C31', '#2BCE48',
			'#FFCC99', '#808080', '#94FFB5', '#8F7C00', '#9DCC00', '#C20088',
			'#003380', '#FFA405', '#FFA8BB', '#FFA8BB', '#426600', '#FF0010',
			'#5EF1F2', '#00998F', '#740AFF', '#990000', '#FF5005', '#FFFF00'
		];

		// From distinguishable colors from matlab. Ugly as sin.

		// var colors = [
		//   0x00ff00, 0x0000ff, 0xff0000, 0xff1ab8, 0x00fff6, 0xffdb72,
		//   0x008cff, 0x007200, 0xffcaed, 0x3d0069, 0xa72b3d, 0x95ff95,
		//   0xb857ff, 0x725708, 0x348ca7, 0xdbff00, 0xff8c00, 0xafc19e,
		//   0x8c5783, 0xf69e83
		// ];

		return colors[ i % colors.length ];
	}
}]);