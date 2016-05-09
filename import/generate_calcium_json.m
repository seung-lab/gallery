
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

roi_data = load('./rawdata/roi_data.mat', '-mat');

savejson('', roi_data.angles, 
	'FileName', './data/angles.json',
	'Compact', 0,
	'ParseLogical', 1
);

disp('Angle order has been saved to ./data/angles.json');

coeffs = load('./rawdata/coeffs16_20151125.mat', '-mat');

savejson('', coeffs.coeffs16{1,2}(:,3:18), 
	'FileName', './data/calcium_activations.json',
	'Compact', 0,
	'ParseLogical', 1
);

disp('Preferred direction activation has been saved to ./data/calcium_activations.json');

savejson('', cell_dict_j, 
	'FileName', './data/verified_cell_mapping.json',
	'Compact', 0,
	'ParseLogical', 1
);

disp('Cell mapping has been saved to ./data/verified_cell_mapping.json');

