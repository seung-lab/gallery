Import Scripts  
==============  

The Museum currently supports four kinds of data:

1. Cell Information: Cell Ids, cell type, coarse & fine depth, et cetera
	- Located: `rawdata/ganglion_cell_info.m` (Matlab/Octave code file)
	- `octave generate_cell_json.m`
	- Outputs: data/ganglion_cells.json which still needs further processing by Python

2. Stratification: The corrected depth profiles of each cell
	- Located: rawdata/strat.mat (Matlab/Octave matrix)

3. Meshes: 3D representations of the cells in OpenCTM format. (CTM = compressed triangle mesh)  
	- It looks like you need to run the mesh export scripts on omelette2?
	- Download MeshLab and find the meshlabserver for `.obj` to `.ctm` conversion
	- mesh.py

4. Activity Maps: Maps of the preferred direction of each neuron.
	- `rawdata/roi_data.mat` (Matlab/Octave matrix)
		- roi.angles has order of angles for coeffs
	- `rawdata/coeffs16.20151125.mat`  
		- coeffs.coeffs16{1,2}(:,3:18) is rows of 8 ON and 8 OFF angles interlaced like ON OFF ON OFF 
		- coeffs is something like this:
			coeffs{x,y}
				- x:
					1. Modeled with single exponential
					2. ????
					3. Modeled with difference of two exponentials
				- y: 
					1. Time before each peak is fixed
					2. Time before each peak is floating
	- `rawdata/cell_dict_j.m`
		- Extracted from https://github.com/seung-lab/e2198_Ca_imaging/blob/master/code/cell_mapping_verified.m
		- newest map of coeffs row ids to omni ids (roi has an older one)

5. Temporal Response Data
	- `temporal_response.mat` (Matlab/Octave matrix) 
	- In field mat.temporal_response, cells are numbered as omni_cell_id => array of temporal response data (floats)

6. Final Ca2+ Export (Tuning Curves)
	- `ca_export_museum.mat` (Matlab/Octave matrix)
	- Final response size for 8 directions and mean temporal response for museum 
	- Thrid row in tuning_ordered_unified_coord_base0 is the on-off combined responses, orded as 0, 45... in the final coordinates.
