import re
import os

class MatlabScript:

  def __init__(self, filename='latest_jinseop.m'):

    self.gc = {}
    
    self.cell_types = {}
    self.cell_classes = {}

    self.fname = os.path.expanduser(filename)
    self.loadMatlabScript()
  
  def loadMatlabScript(self):

    with open(self.fname) as f:
      for line in f.readlines():
        self.parseNames(line)
        
  def parseNames(self,line):
    
    match = re.match(r'struct(\(.*\))', line)
    if match:
      between_parentesis = match.groups()[0]
      parsed =  eval(re.sub(r'(\d+)\s+(\d+)', r'\1,\2,' , between_parentesis)) #replace all the spaces in the list and convert to python struct
      print between_parentesis
      #convert consecuent element of the tuples to key, val
      parsed_dict = {}
      for i in range(0,len(parsed),2):
        parsed_dict[parsed[i]] = parsed[i+1]

      self.cell_types[parsed_dict['name']] = parsed_dict['cells']
      self.appendtoCellClasses(parsed_dict['class'], parsed_dict['name'])


  def appendtoCellClasses(self, class_name , set_name):

    if class_name in self.cell_classes:
      self.cell_classes[class_name].append(set_name)
    
    else:
      self.cell_classes[class_name] = [set_name]




if __name__ == '__main__':
  matlab = MatlabScript()
  print matlab.cell_classes
