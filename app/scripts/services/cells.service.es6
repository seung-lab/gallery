'use strict';
 
/**
 * Using Rails-like standard naming convention for endpoints.
 * GET		 /cells							->	list
 * POST		/cells							->	create
 * GET		 /cells/:id					->	show
 * PUT		 /cells/:id					->	update
 * DELETE	/cells/:id					->	destroy
 */

app.service('cells', [ '$q', '$resource', function ($q, $resource) {
	var api = $resource('/1.0/cells/:id', { id: '@_id' }, { 
		list: { 
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

	this.show = function (cell_id) {
		return $q(function (resolve, reject) {
			api.show({ id: cell_id }, function (cell) {
				cell.color = colorize(cell);
				
				resolve(cell);
			});
		});
	};

	this.list = function (callback) {
		return $q(function (resolve, reject) {
			api.list(function (cellinfos) {
				resolve(cellinfos);

				if (callback) {
					callback(cellinfos);
				}
			});
		});
	};

	this.create = api.create;

	let _color_types = {
      ganglion: {
        index: 0,
        colors: [
         '#edf8e9', '#c7e9c0', '#a1d99b', '#74c476',
         '#41ab5d', '#238b45', '#005a32'
        ]
      },
      bipolar: {
        index: 0,
        colors: [
         '#eff3ff', '#c6dbef', '#9ecae1', '#6baed6',
         '#4292c6', '#2171b5', '#084594'
       ],
      },
      amacrine: {
        index: 0,
        colors: [ 
         '#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', 
         '#ef3b2c', '#cb181d', '#99000d'
       ],
      }
    };

    function colorize (cell) {
      let assignment = { index: 0, colors: [ '#ff0' ] }; // booger green-yellow, indicates problem with data
      if (_color_types[cell.type]) {
        assignment = _color_types[cell.type];
      }

      let color = assignment.colors[ 
        assignment.index % assignment.colors.length 
      ];

      assignment.index++;

      return color;
    }


	// function getColor (i, celltype) {

	// 	return '#fff';

	// 	// From https://en.wikipedia.org/wiki/Help:Distinguishable_colors
	// 	// candy colored

	// 	var colors = [
	// 		'#F0A3FF', '#0075DC', '#993F00', '#4C005C', '#005C31', '#2BCE48',
	// 		'#FFCC99', '#808080', '#94FFB5', '#8F7C00', '#9DCC00', '#C20088',
	// 		'#003380', '#FFA405', '#FFA8BB', '#FFA8BB', '#426600', '#FF0010',
	// 		'#5EF1F2', '#00998F', '#740AFF', '#990000', '#FF5005', '#FFFF00'
	// 	];

	// 	// From distinguishable colors from matlab. Ugly as sin.

	// 	// var colors = [
	// 	//   0x00ff00, 0x0000ff, 0xff0000, 0xff1ab8, 0x00fff6, 0xffdb72,
	// 	//   0x008cff, 0x007200, 0xffcaed, 0x3d0069, 0xa72b3d, 0x95ff95,
	// 	//   0xb857ff, 0x725708, 0x348ca7, 0xdbff00, 0xff8c00, 0xafc19e,
	// 	//   0x8c5783, 0xf69e83
	// 	// ];

	// 	return colors[ i % colors.length ];
	// }
}]);