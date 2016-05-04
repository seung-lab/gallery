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
	- Located: `rawdata/roi_data.mat` (Matlab/Octave matrix)
	- Contains the following fields:
		```octave:2> x = load('roi_data.mat')
		octave:3> fieldnames(x)
		ans = 
			{
			  [1,1] = n_rois
			  [2,1] = roi_sums_all % the Ca2+ data
			  [3,1] = nconds % number of experimental conditions?
			  [4,1] = roi_borders
			  [5,1] = roi_centers
			  [6,1] = cell_dict % Omni => Eyewire cell IDs
			  [7,1] = frames_per_condition % data points per experiment per cell?
			  [8,1] = angles % angles the light was strobed at?
			}```


