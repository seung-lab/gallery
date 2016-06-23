'use strict';

// Adds a new model to the viewer with the provided x, y offset from the UI.This specific model
// creates a tube that follows a collection of 3d points.

app.service('meshService', function ($q, scene, camera) {

	let _this = this;

	this.workers = {
		threads: [],
		index: 0,
	};

	function startThreads () {
		let cores = navigator.hardwareConcurrency || 4;

		for (let i = 0; i < cores - 1; i++) {
			_this.workers.threads.push(
				new Worker("js/workers/PersistentCTMWorker.js")
			);
		}

		_this.workers.index = 0;
	}

	startThreads();

	this.terminateWorkers = function () {
		// this.workers.threads.forEach( (wrkr) => wrkr.terminate() );
		// this.workers.threads = [];

		// startThreads();
	};

	this.createModel = function (cell, progressfn) {
		let url = '/1.0/mesh/' + cell.segment;

		let ctm = new THREE.CTMLoader(false); // showstatus: false

		let _this = this;

		return $q(function (resolve, reject) {
			if (cell.mesh) {
				cell.mesh.material.color = new THREE.Color(cell.color);
				cell.mesh.material.needsUpdate = true;

				resolve(cell);
				return;
			}

			let worker = _this.workers.threads[_this.workers.index];
			_this.workers.index = (_this.workers.index + 1) % _this.workers.threads.length;

			ctm.load(url, progressfn, function (geometry) {
				if (!geometry) {
					reject(cell);
				}

				cell.material = new THREE.MeshLambertMaterial({ 
					color: cell.color, 
					wireframe: false, 
					transparent: false,
					opacity: 1.0,
				});

				cell.mesh = new THREE.Mesh(geometry, cell.material);
				cell.mesh.visible = true; 

				geometry.computeBoundingBox();

				resolve(cell);
			}, { 
				useWorker: true,
				worker: worker,
			});
		});
	}

	this.setVisibility = function (cell, visible) {
		if (!cell.mesh) {
			return;
		}
		
		cell.mesh.visible = visible || false;

		camera.render();
	};

	this.getVisibleBBox = function (cells) {
		let bbox = new THREE.Box3();

		cells.forEach(function (cell) {
			if (cell.mesh && cell.mesh.visible) {
				let meshBbox = cell.mesh.geometry.boundingBox;
				bbox.union(meshBbox)
			}
		});

		// this.showBoundingBox( bbox );
		return bbox;
	}

	this.showBoundingBox = function (bbox) {
		let box_geometry = new THREE.BoxGeometry( bbox.max.x - bbox.min.x , bbox.max.y - bbox.min.y , bbox.max.z - bbox.min.z );
		let material = new THREE.MeshBasicMaterial({ color: 0x666666, wireframe: true });
		let cube = new THREE.Mesh( box_geometry, material );

		let scale = 1.0;
		cube.position.set(
			(bbox.max.x + bbox.min.x) / 2.0, 
			(bbox.max.y + bbox.min.y) / 2.0 * scale, 
			(bbox.max.z + bbox.min.z) / 2.0 * scale
		);
		scene.add(cube);
	};

	this.setOpacity = function (cell, opacity) {
		if (!cell.mesh) {
			return;
		}

		if (opacity == 1.0) {
			cell.mesh.material.transparent = false;
		}
		else {
			cell.mesh.material.transparent = true;
		}

		cell.mesh.material.opacity = opacity;
		cell.mesh.material.needsUpdate = true;
		camera.render();
	};

});
