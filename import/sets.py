import json
from matlab_gc import Parser as Matlab

sets = []
cell_types = {}
matlab = Matlab()

def readCells ( cells_table ):

  for cell in cells_table:
    cell_type =  cell['description']
    if cell_type not in cell_types:
      cell_types[ cell_type ] = [cell['id']]
    else:
      cell_types[ cell_type ].append(cell['id'])

def appendSuperTypes ():

  root = {
    'name': "root",
    'id': 0,
    'children_are_cells': False,
    'children': ["Amacrine Cells","Bipolar Cells","Ganglion Cells",matlab.set_name,"Unkown"]
  }
  sets.append(root)

  ac = {
    'name': "Amacrine Cells",
    'id': len(sets),
    'children_are_cells': False,
    'children': ["wfAC A1","nf AC", "wfAC" , "mfAC", "orphan nfAC", "wfAC bifid", "SAC Off","wfAC WA4-1","SAC On","AII","WF"]
    }
  sets.append(ac)

  bc = {
    'name': "Bipolar Cells",
    'id': len(sets),
    'children_are_cells': False,
    'children': ["BC1","BC2","BC5i","BC5o","BC3a", "BC3b","XBC","BC5t","RBC","BC8","BC9","BC4","BC6","BC7"]
    }
  sets.append(bc)

  gc = {
    'name': "Ganglion Cells",
    'id': len(sets),
    'children_are_cells': False,
    'children': ["biGC4",  "biGC1" ,"biGC3", "onDSGC", "biGC2", "ooDSGC", "biGC5","biGC3b","biGC"]
    }
  sets.append(gc)

  unkown = {
    'name': "Unkown",
    'id': len(sets),
    'children_are_cells': False,
    'children': ["orphan", "less flat", "mid flat", "small flat spiny","broad",
                "midi-J?", "AB-D2/D-BI", "small flat", "Flag", "midi-J", "flat", "unkown type", "NS3","MF","mini-J","large","large flat"]
    }
  sets.append(unkown)

  sets.append(matlab.getSuperSet(len(sets)))

def writeToDisk ():

  print 'there are' , len(sets) ,' cell types'

  with open('sets.json', 'w') as outfile:
    json.dump(sets, outfile,sort_keys = True, indent = 4, ensure_ascii=False)

def process (cells_table):

  readCells( cells_table)
  appendSuperTypes()

  #Append sets from matlab parser
  all_cell_types = dict(cell_types, **matlab.sets);

  for idx, cell_type in enumerate(all_cell_types):

    set_cell = {
      'name' : cell_type,
      'id': str(len(sets)),
      'children_are_cells': True,
      'children': all_cell_types[cell_type]
    }

    sets.append(set_cell)

  convertNameToIds()

  writeToDisk()

def setId ( set_name ):

  found = False;
  set_id = None
  for set_ in sets:

    if set_['name'] == set_name:
      if found == False:
        set_id = set_['id']
        found = True
      else :
        raise Exception('there are two sets with the same name')


  return set_id

def convertNameToIds ():

  for set_ in sets:

    if set_['children_are_cells'] == True:
      continue

    children_names = set_['children']
    children_ids = []

    for child_name in children_names:

      child_id = setId(child_name)

      if child_id != None:

        children_ids.append(str(child_id))

    set_['children'] = children_ids

  

 
      
    



 