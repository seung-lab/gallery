
% Convert matlab cell info '.m' file data into JSON for use in the museum. 
% 
% William Silversmith

addpath('./rawdata', './jsonlab');

disp('Importing....');

cellinfo = ganglion_cell_info();
savejson('', cellinfo, 
	'FileName', './data/ganglion_cells.json',
	'Compact', 0,
	'ParseLogical', 1
);

disp('Cell data has been saved to ./data/ganglion_cells.json');

cellinfo = bipolar_cell_info();
savejson('', cellinfo, 
	'FileName', './data/bipolar_cells.json',
	'Compact', 0,
	'ParseLogical', 1
);

disp('Cell data has been saved to ./data/bipolar_cells.json');

cellinfo = amacrine_cell_info();
savejson('', cellinfo, 
	'FileName', './data/amacrine_cells.json',
	'Compact', 0,
	'ParseLogical', 1
);

disp('Cell data has been saved to ./data/amacrine_cells.json');





