import numpy
import re
import pprint
import scipy.io
import json
import os
from random import randint

import sets

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

  cell_counter = 0
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
      name = 'Cell # ' + str(cell_counter)
    
    try:
      stratification = strat_profiles[int(segment_id)]
    except:
      stratification = []

    if cell_type == '' or cell_type == '-' or cell_type == '?':
      cell_type = "unkown type" 


    cell = {
      "name": name,
      "segment": segment_id,
      "id": str(cell_counter),
      "mesh_id": cell_ids,
      "description": cell_type,
      "stratification": stratification,
      "copyright": " ",
      "color": randColor()
    }

    table.append(cell)
    cell_counter += 1

  return table


def writeCells ():
  with open('cells.json', 'w') as outfile:
    table = load_spreadsheet()
    print 'there are' , len(table) ,' cells'
    json.dump(table, outfile,sort_keys = True, indent = 4, ensure_ascii=False)

    sets.process(table)



  
def omni_export(segment):
  cmd ="/omniData/omni/omni.omnify/omni.export --path /omniData/e2198_reconstruction/mesh.omni --segId "+str(segment)+" --mip 1 --resolution 17,17,24 --obj 2>/dev/null > mesh/"+str(segment)+".obj"
  print cmd
  os.system(cmd)


def convert_to_ctm(segment, clean = True):
  if clean:  
    cmd = "meshlabserver -i mesh/"+str(segment)+".obj -s meshclean.mlx -o mesh/"+str(segment)+".ctm"
  else:
    cmd = "meshlabserver -i mesh/"+str(segment)+".obj -o mesh/"+str(segment)+".ctm"

  os.system(cmd)

def get_meshes ():

  files = os.listdir('./mesh')


  for filename in  files:

    if ".obj" in filename:

      seg = filename.split('.obj')[0]
      ctm = seg + '.ctm'


      if ctm in files and os.path.getsize('./mesh/'+ctm) > 0:
        print 'removing ', seg  
        os.remove('./mesh/'+filename)

      else:

        if os.path.getsize('./mesh/'+filename) == 0:
          omni_export(seg)

        print 'converting', seg
        convert_to_ctm(seg)

  table  = load_spreadsheet()
  for cell in table:
    seg = cell['segment']
    ctm = str(seg) + '.ctm'


    if ctm in files and os.path.getsize('./mesh/'+ctm) > 0:
      continue

    omni_export(seg)
    convert_to_ctm(seg)

writeCells()
