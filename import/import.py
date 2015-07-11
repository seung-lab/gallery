import csv
import numpy
import re
import pprint
import scipy.io
import json
from random import randint

def rgb_to_hex(rgb):
    return '#%02x%02x%02x' % rgb

def randColor ( ):

	mix = { "red": 255, "blue": 255, "green": 255 }

	red = (randint(0,255) + mix['red']) / 2
	blue = (randint(0,255) + mix['blue']) / 2
	green = (randint(0,255) + mix['green']) / 2

	return rgb_to_hex((red,green,blue));


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
		if segment_id == '' :
			continue
		
		segment_id = int(segment_id)

		if name == '-':
			name = 'Cell # Unkown' 
		
		try:
			stratification = strat_profiles[int(segment_id)]
		except:
			stratification = []


		cell = {
			"name": name,
			"segment": segment_id,
			"id": row_idx,
			"mesh_id": cell_ids,
			"description": "cell type "+ cell_type,
			"stratification": stratification,
			"copyright": " ",
      "color": randColor()
		}

		table.append(cell)

	return table



with open('cells.json', 'w') as outfile:
	table = load_spreadsheet()
	json.dump(table, outfile,sort_keys = True, indent = 4, ensure_ascii=False)

