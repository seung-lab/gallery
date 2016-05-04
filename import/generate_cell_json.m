
% Convert matlab cell info '.m' file data into JSON for use in the museum. 
% 
% William Silversmith

addpath('./rawdata', './jsonlab');

disp('Importing....');

gcs = ganglion_cell_info();
savejson('', gcs, 
	'FileName', './data/ganglion_cells.json',
	'Compact', 0,
	'ParseLogical', 1
);

disp('Cell data has been saved to ./data/ganglion_cells.json');




