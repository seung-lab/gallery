import re
import os

class MatlabScript:

  def __init__(self):

    self.gc = {}
    
    self.cell_types = {}
    self.cell_classes = {}


    self.fname =   os.path.expanduser('gc_types_load_cells.m')

    self.loadMatlabScript()



  
  def loadMatlabScript(self):

    with open(self.fname) as f:
      for line in f.readlines():
        
        self.parseNames(line)
        



  def parseNames(self,line):
    name = re.match(r"struct\(.*,\s*'(.*)'\s*,.*,\s*'(.*)'\s*,.*,(.*)\)", line)
    if name != None:

      type_class =  name.groups()[0];
      type_name =  name.groups()[1];
      self.cell_types[type_name] = self.parseSegments( name.groups()[2] )

      self.appendtoCellClasses(type_class, type_name)


  def parseSegments(self, segments_string ):

      return list(set(re.findall(r"(\d+)", segments_string)))
      


  def appendtoCellClasses(self, class_name , set_name):

    if class_name in self.cell_classes:
      self.cell_classes[class_name].append(set_name)
    
    else:
      self.cell_classes[class_name] = [set_name]




if __name__ == '__main__':
  matlab = MatlabScript()
  print matlab.cell_classes
