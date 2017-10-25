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
var tar = require('tar-stream')

var options = { 
	root: path.resolve("data/meshes/"),
	dotfiles: 'deny',
	headers: { 
		"Content-Type": 'application/octet-stream',
		"Access-Control-Allow-Origin": '*',

		// prevent compress from gzipping
		// which erases the content-length header
		// which is necessary for showing progress.
		// gzip -9 doesn't do anything for these anyway
		"Cache-Control": 'no-transform', 
	},
};

function read_file (filename) {
	let filepath = path.join(options.root, filename);

	if (!fs.existsSync(filepath)) {
	    console.log(filename, " -- file doesn't exist!");
	    return Promise.reject();
	}
	console.log(filepath);
	return new Promise(function (resolve, reject) {
		fs.access(filepath, fs.constants.R_OK, (err) => {
			if (err) {
				console.log(err);
				reject(err);
				return;
			}

			fs.readFile(filepath, function (err, data) {
				if (err) { 
					console.log(err);
					reject(err);
				}
				else {
					resolve(data);
				}
			});
		})
	});
}

function transfer_file (filename, res) {
	let filepath = path.join(options.root, filename);

	if (!fs.existsSync(filepath)) {
	    res.sendStatus(404);
	    console.log(filename, " -- file doesn't exist!");
	    return;
	}

	fs.access(filepath, fs.constants.R_OK, (err) => {
		if (err) {
			console.log(err);
			res.sendStatus(403);
			return;
		}

		res.setHeader('content-disposition', `attachment; filename="${filename}"`);
		res.sendFile(filename, options, function (err) {
			if (err) { 
				console.log(err);
			}
		});
	});
}

// Get a single mesh
exports.objformat = function(req, res) {
	console.log(req.params);
	transfer_file(req.params.id + '.obj', res);
};

// Get a single mesh
exports.openctmformat = function(req, res) {
	console.log(req.params);
	transfer_file(req.params.id + '.ctm', res);
};

exports.tarobjs = function (req, res) {
	var cellids = req.query.cellids.split(',');

	if (cellids.length === 1) {
		transfer_file(cellids[0] + '.obj', res);
		return;
	}

	var promises = [];
	var pack = tar.pack() // pack is a streams2 stream 
	cellids.forEach(function (cellid) {
		var filename = cellid + '.obj';
		var read_promise = read_file(filename).then(function (data) {
			pack.entry({ name: filename }, data)
		}, function (err) {
			console.log(err);
		});

		promises.push(read_promise);
	});

	Promise.all(promises).then(function () {
		var filename = req.query.cellids.replace(',', '_');

		pack.finalize()
		res.setHeader('Content-Type', 'application/tar');
		res.setHeader('content-disposition', `attachment; filename="${filename}.tar"`);
		pack.pipe(res);

		pack.on('end', function () {
			res.end();
		});
	}, function (err) {
		console.log(err);
		res.sendStatus(500);
	});
};
