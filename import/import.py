import csv
import numpy
import re
import pprint
import scipy.io
import json


def load_mat():
	strat = dict()

	mat = scipy.io.loadmat('strat.mat');
	for row_idx in range(mat['strat'].shape[0]):
		row = mat['strat'][row_idx]
		segId = row[0][0][0]
		stratification = list(row[1].flat)

		strat[segId] = stratification

	return strat
		



def load_spreadsheet():
	strat_profiles = load_mat()
	
	reader=csv.reader(open("sheet.csv","rb"),delimiter=',')
	sheet = list(reader)


	table = []

	for row_idx in range (1 , len(sheet)):
		row = sheet[row_idx]

		segment_id = row[0]
		cellID = row[1]
		seedID = row[2]
		done_by = row[3]
		name = row[4]
		soma = row[5]
		cell_class = row[6]
		sublayer = row[7]
		on_off = row[8]
		cell_type = row[9]
		countdown_phase = row[10]
		countdown_zone = row[11] 
		notes = row[12]

		
		cell_ids = re.findall(r"(\d+)", cellID)
		cell_ids = map(int, cell_ids)
		if len (cell_ids) == 0 :
			continue

		if name == '-':
			name = 'Cell #' + str(cell_ids[0])
		
		try:
			stratification = strat_profiles[int(segment_id)]
		except:
			stratification = []


		cell = {
			"name": name,
			"id": cell_ids[0],
			"mesh_id": cell_ids,
			"description": "cell type "+ cell_type,
			"stratification": stratification,
			"copyright": " ",
      "color": '#00c5ff'
		}

		table.append(cell)

	return table



with open('cells.json', 'w') as outfile:
	table = load_spreadsheet()
	json.dump(table, outfile,sort_keys = True, indent = 4, ensure_ascii=False)