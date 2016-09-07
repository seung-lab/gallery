import re
import scipy.io
from collections import defaultdict
import json
import math

import subprocess
import sys

allcells = defaultdict(dict)

def slurp_json (fname):
  contents = ""
  with open(fname, 'r') as f:
    contents = f.read()

  return json.loads(contents)

def read_json_into_cells(fname, celltype):
  """Deserialize the JSON file generated from Jinseop's matlab files."""

  # [0] because for some reason jsonlab puts in an extra wrapper array
  cells = slurp_json(fname)[0]

  for cell in cells:
    if type(cell['cells']) == int:
      cell['cells'] = [ cell['cells'] ]

    for cell_id in cell['cells']:
      allcells[cell_id] = {
          "id": cell_id,
          "name": cell['name'],
          "type": celltype,
          "annotation": cell['annotation'],
      }

  return cells

def process_calcium_data():
  # According to Shang Mu, ignore the angles variable in the export file,
  # he manually determined the output order of the third line responses.

  angles = [0, 45, 90, 135, 180, 225, 270, 315] 
  cell_mapping = slurp_json('data/verified_cell_mapping.json')

  mat = scipy.io.loadmat('rawdata/ca_export_museum.mat')#['tuning_ordered_unified_coord_base0'][0]

  responses = mat['tuning_ordered_unified_coord_base0']
  responses = responses[2,:,:] # summary direction tuning is on third row

  numcells = responses.shape[1]

  for roi_id, omni_id in cell_mapping:
    roi_id = roi_id - 1 # matlab to python mapping
    
    response = responses[:, roi_id]
   
    responsemap = {}
    for angle, activation in zip(angles, response):
      responsemap[angle] = activation

    allcells[omni_id]['directional_response'] = {
      "id": roi_id,
      "activations": responsemap,
    }

def read_stratification():
  """
    Reads .strat.mat and parses into 
    a default dict where keys are the
    cells ids and the values are a list,
    if the key doesn't exists and empty list
    is returned
  """
  data = defaultdict(list)
  mat = scipy.io.loadmat('rawdata/skel_strat.mat')['skel_strat'][0]

  nanproblems = []

  # You might be wondering why ['strat'] or ['skel_strat'] ?
  # I have no f* clue, but seems like many mat files
  # have its filenames as a dictionary key 
  # and the value of that dictionary is the actual data being stored

  for i, row in enumerate(mat):
    cell_id = i + 1 # It took me way too long to find this!
    # Matab is 1-index while python is 0-index, so obvious now!

    if row.shape != (1,0):
      data[cell_id] = [ [x,y] for x,y in row ] # convert to list, which is JSON serializable

      if len(data[cell_id]) > 0 and any([ math.isnan(x) or math.isnan(y) for x, y in data[cell_id] ]):
        nanproblems.append(cell_id)
        data[cell_id] = None

  if len(nanproblems):
    print ", ".join([ str(cid) for cid in nanproblems ]), "had NaN values present in its stratification.\n"

  return data

def read_temporal_response():
  """
    Reads .strat.mat and parses into 
    a default dict where keys are the
    cells ids and the values are a list,
    if the key doesn't exists and empty list
    is returned
  """
  data = defaultdict(list)
  mat = scipy.io.loadmat('rawdata/temporal_response.mat')['temporal_response'][0]

  nanproblems = []

  # You might be wondering why ['strat'] or ['skel_strat'] ?
  # I have no f* clue, but seems like many mat files
  # have its filenames as a dictionary key 
  # and the value of that dictionary is the actual data being stored

  for i, row in enumerate(mat):
    cell_id = i + 1 # It took me way too long to find this!
    # Matab is 1-index while python is 0-index, so obvious now!

    if row.shape != (1,0):
      data[cell_id] = [ t[0] for t in row ] # convert to list, which is JSON serializable

      if len(data[cell_id]) > 0 and any([ math.isnan(t) for t in data[cell_id] ]):
        nanproblems.append(cell_id)
        data[cell_id] = None

  if len(nanproblems):
    print ", ".join([ str(cid) for cid in nanproblems ]), "had NaN values present in its temporal response.\n"

  return data

def write_json (object_to_dump , fname):
  
  with open(fname, 'w') as outfile:
    json.dump(object_to_dump, outfile, 
      sort_keys = True, 
      indent = 2, 
      ensure_ascii=False)

    print "Wrote to ", fname

def save_cells_json():
  """
    Do you wanna know the magic behind cells.json
    Read this function to see it with your own eyes
  """

  cells_ready_for_json = []
  strat = read_stratification()
  temporal_response = read_temporal_response()

  classical_types = slurp_json('data/classical_type_map.json')  

  # Write all the parseds cell ids
  # Do chaining of all the list of ids like [20126, 20228]

  problems = {
    "temporal_response": [],
    "stratification": [],
    "directional_response": [],
    "metadata": [],
  }

  for cell_id, cell in allcells.iteritems():
    def maybe(info, key):
      return info[key] if info.has_key(key) else None

    def hasproblem(problem, is_missing):
      if not cell.has_key(is_missing) or cell[is_missing] is None:
        problems[problem].append(cell_id)

    hasproblem('metadata', 'name')

    if (not cell.has_key('directional_response') or cell['directional_response'] is None) and (cell['type'] == 'ganglion' or cell['type'] == 'amacrine'):
        problems['directional_response'].append(cell_id)
    
    if maybe(strat, cell_id) is None:
      problems['stratification'].append(cell_id)    

    if maybe(temporal_response, cell_id) is None:
      problems['temporal_response'].append(cell_id)     

    cell = { 
      "id": cell_id,
      "name": maybe(cell, 'name'),
      "type": maybe(cell, 'type'),
      "segment": cell_id,
      "mesh_id": cell_id,
      "annotation": maybe(cell, 'annotation'),
      "classical_type": None,
      "stratification": maybe(strat, cell_id),
      "temporal_response": maybe(temporal_response, cell_id),
      "directional_response": maybe(cell, 'directional_response'),
    }

    cell['classical_type'] = maybe(classical_types, cell['name'])

    cells_ready_for_json.append(cell)

  problems['metadata'].sort()
  problems['directional_response'].sort()
  problems['stratification'].sort()

  print "Total Cells: ", len(allcells), "\n"

  if len(problems['metadata']):
    print "Did not have cell metadata (", len(problems['metadata']), "): ", ", ".join([ str(cid) for cid in problems["metadata"] ]), "\n"
  
  if len(problems['directional_response']):
    print "Did not have directional_response information (", len(problems['directional_response']), "): ", ", ".join([ str(cid) for cid in problems["directional_response"] ]), "\n"
  
  if len(problems['stratification']):
    print "Did not have stratification data (", len(problems['stratification']), "): ", ", ".join([ str(cid) for cid in problems["stratification"] ]), "\n"

  write_json(cells_ready_for_json, '../server/config/cells.json')

def save_sets_json():
  """
    You know what this does,
    stop reading me
  """

  sets_ready_for_json = []
  #Create the root sets
  #The one that contains other sets or sets of sets,
  # or sets of sets of ..
  json_set = {
    'name' : 'root',
    'id': 0,
    'children_are_cells': False,
    'children': [1]
  }
  sets_ready_for_json.append( json_set )

  #Create the GC super set
  json_set = {
    'name' : 'GC',
    'id': 1,
    'children_are_cells': False,
    'children': range(2,len(celltypes)+2)
  }
  sets_ready_for_json.append( json_set )

  for i, type_name in enumerate(celltypes):
    json_set = {
      'name' : type_name,
      'id': i+2,
      'children_are_cells': True,
      'children': celltypes[type_name]
    }
    sets_ready_for_json.append( json_set )
 
  write_json(sets_ready_for_json, '../server/config/sets.json')

def generate_json():
  """Generate JSON from matlab files from Jinseop and Shang."""

  cmd = "octave generate_cell_json.m"

  print "Executing: ", cmd
  print subprocess.check_output(cmd, shell=True)

  cmd = "octave generate_calcium_json.m"

  print "Executing: ", cmd
  print subprocess.check_output(cmd, shell=True)

def main():
  generate_json()

  read_json_into_cells('data/ganglion_cells.json', 'ganglion')
  read_json_into_cells('data/bipolar_cells.json', 'bipolar')
  read_json_into_cells('data/amacrine_cells.json', 'amacrine')

  process_calcium_data()

  save_cells_json()
  # save_sets_json()

if __name__ == '__main__':
  main()
