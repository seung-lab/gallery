import re
import scipy.io
from collections import defaultdict
import json

celltypes = dict()

def parse_matlab_line(line):
  """
    Magic function which read the obscure matlab file and
    extract the useful information
  """

  line_starts_with_struct = re.match(r'struct(\(.*\))', line)
  if not line_starts_with_struct:
    return

  whatever_is_inside_struct_parentesis = line_starts_with_struct.groups()[0]

  #replace all the spaces in the list matlab array to commas
  #after doing that trick I can just eval to convert to python tuple
  formated_string = re.sub(r'(\d+)\s+(\d+)', r'\1,\2,' , whatever_is_inside_struct_parentesis) 
  python_tuple =  eval(formated_string) #ta daaa
  
  #python tuple looks like this
  #('name', 'orphans', 'annotation', '', 'cells', [20126, 20228])

  python_dict =  convert_tuple_to_dict(python_tuple)
  #python_dict looks like
  #{'cells': [20126, 20228], 'name': 'orphans', 'annotation': ''}
  #So much nicer eh?

  #Save each celltype to a global dictionary
  #We are going to use this dictionary to create the sets.json
  celltypes[ python_dict['name'] ] = python_dict['cells']

def convert_tuple_to_dict( t ):
  """
    This tuple is a succession of key and value
    (k,v,k,v ...)
  """
  d = dict()
  for i in xrange(0,len(t),2):
    d[t[i]] = t[i+1]
  return d

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
    json.dump(object_to_dump , outfile, 
      sort_keys = True, 
      indent = 2, 
      ensure_ascii=False)

def save_cells_json():
  """
    Do you wanna know the magic behind cells.json
    Read this function to see it with your own eyes
  """

  cells_ready_for_json = []
  strat = read_stratification()
  #Write all the parseds cell ids
  #Do chaining of all the list of ids like [20126, 20228]
  
  for celltype in celltypes:
    for cell_id in celltypes[celltype]:
      #Do we really need to put c everywhere?
      #I don't remember so let us put it
      cell = {  
        "name": '# '+ str(cell_id),
        "type": celltype,
        "segment": cell_id,
        "id": cell_id,
        "mesh_id": cell_id,
        "stratification": strat[cell_id]
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



def main():
  #We first read the matlab script from jinseop
  with open('rawdata/ganglion_cell_info.m') as f:
    for line in f.readlines():
      parse_matlab_line(line)

  save_cells_json()
  save_sets_json()

if __name__ == '__main__':
  main()
