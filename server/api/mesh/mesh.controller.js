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

	res.sendFile(req.params.id + '.ctm' , options, function (err) {
		if (err) { 
			res.send("File doesn't exist!");
		}
	});
};
