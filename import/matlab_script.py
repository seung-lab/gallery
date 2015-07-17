import re

class MatlabScript:

  def __init__(self):

    self.gc = {}
    
    self.cell_types = {}
    self.cell_classes = { 'GC bistratified':[] , 'GC monostratified':[] }


    self.fname =  'gc_types_load_cells.m'

    self.loadMatlabScript()





  
  def loadMatlabScript(self):

    with open(self.fname) as f:
      for line in f.readlines():
        
        self.parseNames(line)
        
        self.parseSegments(line)

    self.convertToSets()


  def parseNames(self,line):
    name = re.match(r"gc\((\d*)\).name\s*=\s*['|\"](.*)['|\"]", line)
    if name != None:

      type_id =  name.groups()[0];
      type_name =  name.groups()[1];

      self.gc[type_id] = { 'name':type_name}

      self.appendtoCellClasses(type_id, type_name)


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

  def appendtoCellClasses(self, idx, set_name):
    idx = int(idx)

    if idx < 17:
      self.cell_classes['GC bistratified'].append(set_name)
    
    else:

      self.cell_classes['GC monostratified'].append(set_name)




if __name__ == '__main__':
  matlab = MatlabScript()
  print matlab.cell_types
