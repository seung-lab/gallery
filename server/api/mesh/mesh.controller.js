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
		},
	};

	var filename = req.params.id + '.ctm';

	res.sendFile(filename, options, function (err) {
		if (err) { 
			console.log(filename, " -- file doesn't exist!");
		}
	});
};
