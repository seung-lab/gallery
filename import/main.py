import re
import scipy.io
from collections import defaultdict
import json

import subprocess

allcells = dict()

def read_json_into_cells(fname, celltype):
  """Deserialize the JSON file generated from Jinseop's matlab files."""

  contents = ""
  with open(fname, 'r') as f:
    contents = f.read()

  # [0] because for some reason jsonlab puts in an extra wrapper array
  cells = json.loads(contents)[0]

  for cell in cells:
    for cell_id in cell['cells']:
      allcells[cell_id] = {
          "id": cell_id,
          "name": cell['name'],
          "type": celltype,
          "annotation": cell['annotation'],
      }

  return cells


def do_some_parsing( array ):
  """
    This have just changed
    What should we do?

    is a 2d array, where the first column
    is the x position, and the second y
  """


  return list(array[200:300,1])

def read_stratification():
  """
    Reads .strat.mat and parses into 
    a default dict where keys are the
    cells ids and the values are a list,
    if the key doesn't exists and empty list
    is returned
  """
  s = defaultdict(list)
  mat = scipy.io.loadmat('rawdata/strat.mat')['strat']
  #You might be wondering why ['start'] ?
  #I have no f* clue, but seems like many mat files
  #have its filenames as a dictionary key 
  #and the value of that dictionary is the actual data being stored
  for i, row in enumerate(mat):
    cell_id = i + 1 #It took me way too long to find this!
    #Matab is 1-index why python is 0-index, so obvious now!
    
    if row[0].shape != (1,0):
    #Why row[0] ?  Why not?
      parse_stratification_for_cell = do_some_parsing(row[0])
      s[cell_id] = parse_stratification_for_cell

  return s


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
  # Write all the parseds cell ids
  # Do chaining of all the list of ids like [20126, 20228]
  
  
  for cell_id, cell in allcells.iteritems():
      cell = {  
        "id": cell_id,
        "name": cell['name'],
        "type": cell['type'],
        "segment": cell_id,
        "mesh_id": cell_id,
        "annotation": cell['annotation'],
        "stratification": strat[cell_id],
      }

      cells_ready_for_json.append(cell)

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

def generate_jinseop_json():
  """Generate JSON from matlab files from Jinseop."""

  cmd = "octave generate_cell_json.m"

  print "Executing: ", cmd
  print subprocess.check_output(cmd, shell=True)

def main():
  
  generate_jinseop_json()

  read_json_into_cells('data/ganglion_cells.json', 'ganglion')
  read_json_into_cells('data/bipolar_cells.json', 'bipolar')

  save_cells_json()
  save_sets_json()

if __name__ == '__main__':
  main()
