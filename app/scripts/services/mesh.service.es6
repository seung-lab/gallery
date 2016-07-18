'use strict';

// Adds a new model to the viewer with the provided x, y offset from the UI.This specific model
// creates a tube that follows a collection of 3d points.

app.service('meshService', function ($q, scene, camera) {
	this.tasks = [];
	this.workers = [];
	this.maxWorkerCount = navigator.hardwareConcurrency || 2;

	this.terminateWorkers = function () {
		this.workers.forEach( (wrkr) => wrkr.terminate() );
		this.workers = [];
	};

	let _this = this;
	this.popTask = setInterval(function () {
		if (_this.tasks.length === 0 || _this.workers.length >= _this.maxWorkerCount) {
		    return;
		}
		
		let worker = new Worker("js/workers/CTMWorker.js");
		if (!worker) {
			return;
		}

		_this.workers.push(worker);

		let ctm = new THREE.CTMLoader(false); // showstatus: false
		let task = _this.tasks.shift();

		let url = '/1.0/mesh/' + task.cell.segment;

		ctm.load(url, task.progress, function (geometry) {
			if (!geometry) {
				task.reject(task.cell);
			}

			let workerindex = _this.workers.indexOf(worker);
			if (workerindex !== -1) {
				_this.workers.splice(workerindex, 1);
			}

			task.cell.material = new THREE.MeshLambertMaterial({ 
				color: task.cell.color, 
				wireframe: false, 
				transparent: false,
				opacity: 1.0,
			});

			task.cell.mesh = new THREE.Mesh(geometry, task.cell.material);
			task.cell.mesh.visible = true; 

			geometry.computeBoundingBox();

			task.resolve(task.cell);
		}, { 
			useWorker: true,
			worker: worker,
		});
	}, 200);

	this.createModel = function (cell, progressfn) {
		let _this = this;

		return $q(function (resolve, reject) {
			if (cell.mesh) {
				cell.mesh.material.color = new THREE.Color(cell.color);
				cell.mesh.material.needsUpdate = true;

				resolve(cell);
				return;
			}

			_this.tasks.push({
				cell: cell,
				progress: progressfn,
				resolve: resolve,
				reject: reject
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
