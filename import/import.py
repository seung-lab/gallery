import json
from random import randint

from cells import *
from matlab_script import *


class Importer:

  def __init__(self):
    
    self.cells_fname = '../server/config/cells.json'
    self.sets_fname =  '../server/config/sets.json'

    # self.stratification = Stratification()
    self.matlab_script = MatlabScript()

    self.cell_classes = {}
    self.cell_types = {}

    self.cell_sets = []

    self.processCells()
    self.processSets()

  def  processCells(self):

    cells = []
    stratification = Stratification('~/seungmount/Omni/e2198_reconstruction/gallery/obj_museum/strat_160212.mat').get()

    all_segments = set()
    for segments in self.matlab_script.cell_types.values():
      all_segments = all_segments.union( set(segments) )

    print stratification.keys()
    for segment_id in all_segments:  

      if str(segment_id) in stratification:
        strat = stratification[ str(segment_id) ]
        if float('NaN') == strat[0]:
          strat = numpy.zeros(100)
      else:
        strat = numpy.zeros(100)
        print 'no stratification for ', segment_id
        
      if type(strat) is not list or sum(strat) == 0:
        strat = numpy.zeros(100)

      cell = {  

        "name": '# '+ str(segment_id),
        "segment": segment_id,
        "id": segment_id,
        "stratification": list(strat)      }

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

    # self.cell_types = self.spreadsheet.cell_types
    for set_name in self.matlab_script.cell_types:
      
      if set_name in self.cell_types:
        print 'overwritting type '+ set_name

      segment_ids = self.matlab_script.cell_types[ set_name ]
      self.cell_types[set_name] = segment_ids


  def mergeCellClasses(self):
    
    # self.cell_classes = self.spreadsheet.cell_classes
    for set_name in self.matlab_script.cell_classes:

      if set_name in self.cell_classes:
        print 'overwritting class '+ set_name

      children_names = self.matlab_script.cell_classes[ set_name ]
      self.cell_classes[set_name] = children_names

  def createRootSet(self):

    self.appendSet('Sets', self.cell_classes.keys(), children_are_cells = False)

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