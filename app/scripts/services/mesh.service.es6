'use strict';

// Adds a new model to the viewer with the provided x, y offset from the UI.This specific model
// creates a tube that follows a collection of 3d points.

app.service('mesh', function ($q, scene, camera, cells, CacheFactory) {
	let _cache = CacheFactory('meshes', { capacity: 50 });

	let _displayed = [];

	function get (cell_id, callback) {
		if (!cell_id) {
			callback(null);
			return;
		}

		let cell = _cache.get(cell_id.toString());

		return $q(function (resolve, reject) {
			if (cell) {
				resolve(cell);
				callback(cell);
			}
			else {
				cells.show(cell_id, function (cell) {
					createModel(cell, function (cell) {
						_cache.put(cell_id.toString(), cell);
						resolve(cell);
						callback(cell);
					});
				});
			}
		});
	}

	function createModel (cell, callback) {
		let url = '/1.0/mesh/' + cell.segment;

		let ctm = new THREE.CTMLoader(false); // showstatus: false
		ctm.load(url, function (geometry) { 
			cell.material = new THREE.MeshLambertMaterial({ 
				color: cell.color, 
				wireframe: false, 
				transparent: false, 
				opacity: 1.0,
			});

			cell.mesh = new THREE.Mesh(geometry, cell.material);
			cell.mesh.visible = true; 

			geometry.computeBoundingBox();

			callback(cell);
		}, { 'useWorker': true } );
	}

	this.display = function (neurons, callback) {
		if (!Array.isArray(neurons)) {
			neurons = [ neurons ];
		}

		let loaded = [];
		
		for (let cell_id of neurons) {
			let promise = get(cell_id, function (cell) {
				scene.add(cell.mesh);
				_displayed.push(cell.mesh);

				camera.render();
			});

			loaded.push(promise);
		}

		$q.all(loaded).then(function () {
			callback();		
			camera.render();
		});
	};

	this.clear = function () {
		for (let msh of _displayed) {
			scene.remove(msh);
		}

		_displayed = [];
		
		camera.render();
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
		let bbox = new THREE.Box3();

		for (let cell_id of _cache.keys()) {
			get(cell_id, function (cell) { 
				if (cell.mesh.visible) {
					let meshBbox = cell.mesh.geometry.boundingBox;
					bbox.union(meshBbox)
				}
			});
		}

		// showBoundingBox( bbox );
		return bbox;
	}


	let showBoundingBox = function (bbox) {

		let box_geometry = new THREE.BoxGeometry( bbox.max.x - bbox.min.x , bbox.max.y - bbox.min.y , bbox.max.z - bbox.min.z );
		let material = new THREE.MeshBasicMaterial({ color: 0x000, wireframe: true });
		let cube = new THREE.Mesh( box_geometry, material );

		let scale = 1.0;
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
