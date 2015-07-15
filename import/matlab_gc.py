import re

gc = {}
fname = 'gc_types_load_cells.m'

with open(fname) as f:
  for line in f.readlines():
    
    name = re.match(r"gc\((\d*)\).name\s*=\s*['|\"](.*)['|\"]", line)
    if name != None:

      type_id =  name.groups()[0];
      type_name =  name.groups()[1];

      gc[type_id] = { 'name':type_name};

    
    segments = re.match(r"gc\((\d*)\).cells\s*=\[(.*)\]", line)
    if segments != None:
      type_id = segments.groups()[0]

      segment_list = segments.groups()[1]
      type_segments = re.findall(r"(\d+)", segment_list)
      gc[type_id]['segments'] = type_segments


print gc;