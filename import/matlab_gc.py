import re

class Parser:

  def __init__(self):

    self.gc = {}
    self.sets = {}
    self.fname =  'gc_types_load_cells.m'
    self.set_name = 'Updated Ganglion Set'
    self.readMatlab()


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

      self.sets[name] = segments


  def readMatlab(self):

    with open(self.fname) as f:
      for line in f.readlines():
        
        self.parseNames(line)
        
        self.parseSegments(line)

    self.convertToSets()

  def getSuperSet(self, set_id):
      
    super_set = {
      'name': self.set_name,
      'id': set_id,
      'children_are_cells': False,
      'children': self.sets.keys()
    }
    return super_set


if __name__ == '__main__':
  matlab = Parser()
  print matlab.sets
  print matlab.getSuperSet(1)