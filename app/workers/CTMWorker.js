importScripts( "lzma.js", "ctm.js" );

self.onmessage = function (msg) {

	var data = new Uint8Array(msg.data.dataBuffer);

	var files = [];

	var xferbuffers = [];

	for ( var i = 0; i < msg.data.offsets.length; i ++ ) {

		var stream = new CTM.Stream(data);
		stream.offset = msg.data.offsets[ i ];

		var file = new CTM.File( stream );

		file.body.indices = file.body.indices.buffer; // UInt32Array
		file.body.vertices = file.body.vertices.buffer; // Float32Array

		if (file.body.normals) {
			file.body.normals = file.body.normals.buffer; // Float32Array
		}

		// In CTM.js all of them use the same underlying arraybuffer
		xferbuffers.push(file.body.indices);

		files[ i ] = file;
	}

	self.postMessage(files, xferbuffers);
	self.close();

}
