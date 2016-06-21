/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /mesh              ->  index
 * POST    /mesh              ->  create
 * GET     /mesh/:id          ->  show
 * PUT     /mesh/:id          ->  update
 * DELETE  /mesh/:id          ->  destroy
 */

var path = require('path');
var fs = require('fs');

// Get a single mesh
exports.show = function(req, res) {

	var options = { 
		root: path.resolve("data/meshes/"),
		dotfiles: 'deny',
		headers: { 
			"Content-Type": 'text/plain',

			// prevent compress from gzipping
			// which erases the content-length header
			// which is necessary for showing progress.
			// gzip -9 doesn't do anything for these anyway
			"Cache-Control": 'no-transform', 
		},
	};

	var filename = req.params.id + '.ctm';

	res.sendFile(filename, options, function (err) {
		if (err) { 
			console.log(filename, " -- file doesn't exist!");
		}
	});
};
