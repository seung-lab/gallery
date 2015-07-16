import re

class MatlabScript:

  def __init__(self):

    self.gc = {}
    
    self.cell_types = {}
    self.cell_classes = {}


    self.fname =  'gc_types_load_cells.m'
    self.set_name = 'Ganglion Cells'

    self.loadMatlabScript()



  
  def loadMatlabScript(self):

    with open(self.fname) as f:
      for line in f.readlines():
        
        self.parseNames(line)
        
        self.parseSegments(line)

    self.convertToSets()

    self.cell_classes[self.set_name] = self.cell_types.keys()

  def parseNames(self,line):
    name = re.match(r"gc\((\d*)\).name\s*=\s*['|\"](.*)['|\"]", line)
    if name != None:

      type_id =  name.groups()[0];
      type_name =  name.groups()[1];

      self.gc[type_id] = { 'name':type_name};


  def parseSegments(self,line):

    segments = re.match(r"gc\((\d*)\).cells\s*=\[(.*)\]", line)
    if segments != None:
      type_id = segments.groups()[0]

      segment_list = segments.groups()[1]
      type_segments = re.findall(r"(\d+)", segment_list)
      self.gc[type_id]['segments'] = type_segments

  def convertToSets(self):

    for idx in self.gc:
      name = self.gc[idx]['name']
      segments = self.gc[idx]['segments']

      self.cell_types[name] = segments


if __name__ == '__main__':
  matlab = MatlabScript()
  print matlab.cell_types
