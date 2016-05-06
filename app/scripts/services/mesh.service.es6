'use strict';

// Adds a new model to the viewer with the provided x, y offset from the UI.This specific model
// creates a tube that follows a collection of 3d points.

app.service('mesh', function (scene, camera, cells, CacheFactory) {
	var cache = CacheFactory('meshes', { capacity: 50 });


	function get (cell_id, callback) {
		if (!cell_id) {
			callback(null);
			return;
		}

		var cell = cache.get(cell_id.toString());

		if (cell) {
			callback(cell);
		}
		else {
			cells.show(cell_id, function (cell) {
				createCell(cell, function (cell) {
					cache.put(cell_id.toString(), cell);
					callback(cell);
				});
			});
		}
	}

	function createCell (cell, callback) {
		var url = '/1.0/mesh/' + cell.segment;

		var ctm = new THREE.CTMLoader(false); // showstatus: false
		ctm.load(url, function (geometry) { 
			cell.material = new THREE.MeshLambertMaterial({ 
				color: 0xffffff, 
				wireframe: false, 
				transparent: false, 
				opacity: 1.0,
			});

			cell.mesh = new THREE.Mesh(geometry, cell.material);
			cell.mesh.visible = true; 
			scene.add(cell.mesh);

			geometry.computeBoundingBox();

			callback(cell);
		}, { 'useWorker': true } );
	}

	this.display = function (neurons, callback) {
		if (!Array.isArray(neurons)) {
			neurons = [ neurons ];
		}

		let loaded = 0;
		
		for (let cell_id of neurons) {
			get(cell_id, function () {
				loaded++;

				// When all the neurons has being loaded , the callback is call
				// This is used in the viewer to set the camera
				if (loaded == neurons.length) {
					callback();
				}
			});
		}
	};


	this.toggleVisibility = function (cell_id) {

		get(cell_id, function (cell) { 
			if (cell.mesh.visible == true) {
				cell.mesh.visible = false;
			}
			else {
				cell.mesh.visible = true;
			}

			camera.render();
		});
	};

	// FIXME the for loop will get all the elements, making the cache not remove the old elements not in use
	this.getVisibleBBox = function () {
		var bbox = new THREE.Box3();

		for (let cell_id of cache.keys()) {
			get(cell_id, function (cell) { 
				if (cell.mesh.visible) {
					var meshBbox = cell.mesh.geometry.boundingBox;
					bbox.union(meshBbox)
				}
			});
		}

		// showBoundingBox( bbox );
		return bbox;
	}


	var showBoundingBox = function (bbox) {

		var box_geometry = new THREE.BoxGeometry( bbox.max.x - bbox.min.x , bbox.max.y - bbox.min.y , bbox.max.z - bbox.min.z );
		var material = new THREE.MeshBasicMaterial({ color: 0x000, wireframe: true });
		var cube = new THREE.Mesh( box_geometry, material );

		var scale = 1.0;
		cube.position.set(
			(bbox.max.x + bbox.min.x) / 2.0, 
			(bbox.max.y + bbox.min.y) / 2.0 * scale, 
			(bbox.max.z + bbox.min.z) / 2.0 * scale
		);
		scene.add(cube);
	};

	this.setOpacity = function (cell_id, opacity) {
		
		get(cell_id, function (cell) {
			if (opacity == 1.0) {
				cell.mesh.material.transparent = false;
			}
			else {
				cell.mesh.material.transparent = true;
			}

			cell.mesh.material.opacity = opacity;
			cell.mesh.material.needsUpdate = true;
			camera.render();
		});

	};

});


