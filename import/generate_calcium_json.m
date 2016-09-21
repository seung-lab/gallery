
% 4. Activity Maps: Maps of the preferred direction of each neuron.
% 	- `rawdata/roi_data.mat` (Matlab/Octave matrix)
% 		- roi.angles has order of angles for coeffs
% 	- `rawdata/coeffs16.20151125.mat`  
% 		- coeffs.coeffs16{1,2}(:,3:18) is rows of 8 ON and 8 OFF angles interlaced like ON OFF ON OFF 
% 		- coeffs is something like this:
% 			coeffs{x,y}
% 				- x:
% 					1. Modeled with single exponential
% 					2. ????
% 					3. Modeled with difference of two exponentials
% 				- y: 
% 					1. Time before each peak is fixed
% 					2. Time before each peak is floating
% 	- `rawdata/cell_dict_j.m`
% 		- Extracted from https://github.com/seung-lab/e2198_Ca_imaging/blob/master/code/cell_mapping_verified.m
% 		- newest map of coeffs row ids to omni ids (roi has an older one)

addpath('./rawdata', './jsonlab');

% Note: Decided to do this with scipy in main.py since the output here was weird

% calcium_direction = load('./rawdata/ca_export_museum.mat', '-mat');

% savejson('', calcium_direction.angles, 
% 	'FileName', './data/angles.json',
% 	'Compact', 0,
% 	'ParseLogical', 1
% );

% disp('Angle order has been saved to ./data/angles.json');

% savejson('', calcium_direction.tuning_ordered_unified_coord_base0(3,:,:), 
% 	'FileName', './data/calcium_directional_response.json',
% 	'Compact', 0,
% 	'ParseLogical', 1
% );

% disp('Preferred direction activation has been saved to ./data/calcium_directional_response.json');
% disp('Note: Cells are labeled by ROI ID. Use verified_cell_mapping.json to map to omni IDs.')

savejson('', cell_dict_j, 
	'FileName', './data/verified_cell_mapping.json',
	'Compact', 0,
	'ParseLogical', 1
);

disp('Cell mapping has been saved to ./data/verified_cell_mapping.json');

