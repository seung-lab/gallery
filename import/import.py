import json
from random import randint

from cells import *
from matlab_script import *


class Importer:

  def __init__(self):
    
    self.cells_fname = '../server/config/cells.json'
    self.sets_fname =  '../server/config/sets.json'

    self.mix_color = { "red": 255, "blue": 255, "green": 255 }

    self.stratification = Stratification()
    self.spreadsheet = Spreadsheet()
    self.matlab_script = MatlabScript()

    self.cell_classes = {}
    self.cell_types = {}

    self.cell_sets = []

    self.processCells()
    self.processSets()



  def rgb_to_hex(self, rgb):
    return '#%02x%02x%02x' % rgb

  def randColor (self):
    "it averages a base color, with a random color to generate a palette"

    red = (randint(0,255) + self.mix_color['red']) / 2
    blue = (randint(0,255) + self.mix_color['blue']) / 2
    green = (randint(0,255) + self.mix_color['green']) / 2

    return self.rgb_to_hex((red,green,blue));



  def  processCells(self):

    cells = []

    spreadsheet = self.spreadsheet.get()

    full_strat = Stratification()
    mono_strat = Stratification('strat_150717.mat')
  
    for segment_id in full_strat.stratification:
      if segment_id in  mono_strat.stratification:

        full_strat.stratification[segment_id] = mono_strat.stratification[segment_id]
    

    stratification = full_strat.stratification

    for segment_id in self.spreadsheet.get():

      row = spreadsheet[segment_id]

      cell = {  

        "name": '# '+ segment_id,
        "segment": segment_id,
        "id": segment_id,
        "mesh_id": row['database_ids'],
        "description": 'name: '+ row['name'] + '\n class: '+ row['cell_class'] + '\n  type:' + row['cell_type'], 
        "stratification": stratification[ segment_id ],
        "copyright": " Or another longer description ",
        "color": self.randColor()
      }

      cells.append(cell)

    self.writeJson(cells, self.cells_fname)


  def processSets(self):

    self.mergeCellTypes()

    self.mergeCellClasses()

    self.createRootSet()

    for set_name in self.cell_classes:

      children_names = self.cell_classes[ set_name ]
      self.appendSet( set_name, children_names, children_are_cells = False)

    for set_name in self.cell_types:

      segment_ids = self.cell_types[ set_name ]
      self.appendSet( set_name, segment_ids, children_are_cells = True)


    self.replaceChildrenNamesWithCorrespodingIds()

    self.writeJson( self.cell_sets, self.sets_fname)

  def mergeCellTypes(self):

    self.cell_types = self.spreadsheet.cell_types
    for set_name in self.matlab_script.cell_types:
      
      if set_name in self.cell_types:
        print 'overwritting type '+ set_name

      segment_ids = self.matlab_script.cell_types[ set_name ]
      self.cell_types[set_name] = segment_ids


  def mergeCellClasses(self):
    
    self.cell_classes = self.spreadsheet.cell_classes
    for set_name in self.matlab_script.cell_classes:

      if set_name in self.cell_classes:
        print 'overwritting class '+ set_name

      children_names = self.matlab_script.cell_classes[ set_name ]
      self.cell_classes[set_name] = children_names

  def createRootSet(self):

    self.appendSet('root', self.cell_classes.keys(), children_are_cells = False)

  def replaceChildrenNamesWithCorrespodingIds(self):
    
    for cell_set in self.cell_sets:

      if cell_set['children_are_cells'] == True:
        continue

      replaced_children = []
      for child_id in cell_set['children']:

        replaced_children.append( self.getCellSetId( child_id ) )

      cell_set['children'] = replaced_children


  def getCellSetId(self, name):

    for cell_set in self.cell_sets:

      if cell_set['name'] == name:
        return cell_set['id']

    return None


  def appendSet(self, name, children , children_are_cells ):

    cell_set = {
      'name' : name,
      'id': str(len(self.cell_sets)),
      'children_are_cells': children_are_cells,
      'children': children
    }

    self.cell_sets.append(cell_set)


  def writeJson (self, object_to_dump , fname):
    
    with open(fname, 'w') as outfile:

      json.dump(object_to_dump , outfile, sort_keys = True, indent = 2, ensure_ascii=False)





if __name__ == '__main__':
  
  importer = Importer()