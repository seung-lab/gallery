Import Scripts  
==============  

The Museum currently supports four kinds of data:

1. Cell Information: Cell Ids, cell type, coarse & fine depth, et cetera
	- octave generate_cell_json.m
	- Outputs: data/cells.json which still needs further processing by Python

2. Stratification: The corrected depth profiles of each cell
3. Meshes: 3D representations of the cells in OpenCTM format. (CTM = compressed triangle mesh)  
4. Activity Maps: Maps of the preferred direction of each neuron.

