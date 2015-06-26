/**
 * author @ Mark Richardson
 **/

THREE.Segment = function (interleavedData, material) {
	"use strict";

	var _this = this; 
	var _interleavedData, _webglPositionNormalBuffer;

	THREE.Object3D.call(this);
	this.interleavedData = interleavedData;
	this.type = THREE.Segment;
	this.material = material;
	

	this.immediateRenderCallback = function (program, _gl, _frustum) {
		if (!_webglPositionNormalBuffer) {
			_webglPositionNormalBuffer = _gl.createBuffer();
		}
		_gl.disable(_gl.CULL_FACE);

		_gl.bindBuffer(_gl.ARRAY_BUFFER, _webglPositionNormalBuffer);
		_gl.bufferData(_gl.ARRAY_BUFFER, _this.interleavedData, _gl.STATIC_DRAW);

		// NB: Unintiuitive bug fix. Compiler was optimizing away
		// the normal attribute in certain builds of firefox and
		// seemingly randomly returning -1 for the normal attribute
		// location. Since we have constructed the Vertex Array Object (VAO)
		// we can explicitly tell the compiler to not fucking ignore it.
		//
		// VAO objects have a standard definition, that's an additional
		// reason why this is safe to do.
		//
		// - Will Silversmith, Aug. 2014

			
		// This was causing problems with our Princeton Ubuntu 14.04 installations.
		if (program.attributes.normal === -1) {
			_gl.bindAttribLocation(program.program, 0, 'position');
			_gl.bindAttribLocation(program.program, 1, 'normal');
			program.attributes.position = 0;
			program.attributes.normal = 1;
		}

		// _gl.enableVertexAttribArray(index);
		_gl.enableVertexAttribArray(program.attributes.position);
		_gl.enableVertexAttribArray(program.attributes.normal);

		// _gl.vertexAttribPointer(index, size, type, normalized, stride, pointer)
		_gl.vertexAttribPointer(program.attributes.position, 3, _gl.FLOAT, false, 24, 0);
		_gl.vertexAttribPointer(program.attributes.normal, 3, _gl.FLOAT, false, 24, 12);
	
		// _gl.drawArrays(mode, start, count)
		// 6 = dimensions per vertex: 3 for position, 3 for normal vector
		_gl.drawArrays(_gl.TRIANGLE_STRIP, 0, _this.interleavedData.length / 6);
	};

	this.computeBoundingBox = function() {

		var max_z = 0, max_y = 0, max_x = 0;
		var min_z = interleavedData[2], min_y = interleavedData[1], min_x = interleavedData[0];

		for ( var i = 0; i < this.interleavedData.length; ++i) {
			if (i % 6 > 2)
				continue;

			if (i % 6 == 0) {
				if ( this.interleavedData[i] > max_x ) {
					max_x = this.interleavedData[i];
				}
				if ( this.interleavedData[i] < min_x ) {
					min_x = this.interleavedData[i];
				}
			}
			if (i % 6 == 1) {
				if ( this.interleavedData[i] > max_y ) {
					max_y = this.interleavedData[i];
				}
				if ( this.interleavedData[i] < min_y ) {
					min_y = this.interleavedData[i];
				}
			}
			if (i % 6 == 2) {
				if ( this.interleavedData[i] > max_z ) {
					max_z = this.interleavedData[i];
				}
				if ( this.interleavedData[i] < min_z ) {
					min_z = this.interleavedData[i];
				}
			}
		}

		var bbox = { min: new THREE.Vector3(min_x, min_y, min_z), max: new THREE.Vector3(max_x, max_y, max_z) }
		this.boundingBox = bbox;
	}
};

THREE.Segment.prototype = new THREE.Object3D();
THREE.Segment.prototype.constructor = THREE.Segment;
