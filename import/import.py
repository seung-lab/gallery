import csv
import numpy
import re
import pprint

reader=csv.reader(open("sheet.csv","rb"),delimiter=',')
sheet = list(reader)


result = []

for row_idx in range (1 , len(sheet)):
	row = sheet[row_idx]

	segID = row[0]
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

	cell = {
		"name": name,
		"id": cell_ids[0],
		"mesh_id": cell_ids
	}

	print cell
	result.append(cell)


