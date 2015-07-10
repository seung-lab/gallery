import csv
from subprocess import call

def convert_to_ctm(segment):
	call(["meshlabserver","-i", "mesh/"+str(segment)+".obj","-s","meshclean.mlx","-o","mesh/"+str(segment)+".ctm"])

def omni_export(segment):
	call(["/omniData/omni/omni.omnify/omni.export","--path","/omniData/e2198_reconstruction/mesh.omni","--segId",str(segment),"--mip","1","--resolution","17,17,24","--obj","2>/dev/null",">","mesh/"+str(segment)+".obj"])


def load_spreadsheet():
	
	reader=csv.reader(open("./sheet.csv","rb"),delimiter=',')
	sheet = list(reader)

	table = []

	for row_idx in range (1 , len(sheet)):
		row = sheet[row_idx]

		segment_id = row[0]
		if segment_id == '':
			continue

		omni_export(segment_id)
		convert_to_ctm(segment)


load_spreadsheet()


