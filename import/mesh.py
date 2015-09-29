import os
from cells import *

class Meshes:

  def __init__(self):
    pass

  def omni_export(self,segment):
    cmd ="/omniData/omni/omni.omnify/omni.export --path /omniData/e2198_reconstruction/mesh.omni --segId "+str(segment)+" --mip 1 --resolution 17,17,24 --obj 2>/dev/null > mesh/"+str(segment)+".obj"
    print cmd
    os.system(cmd)


  def convert_to_ctm(self,path ,segment, clean = True):
    if clean:  
      cmd = "meshlabserver -i "+path+str(segment)+".obj -s meshclean.mlx -o mesh/"+str(segment)+".ctm"
    else:
      cmd = "meshlabserver -i "+path+str(segment)+".obj -o mesh/"+str(segment)+".ctm"

    os.system(cmd)

  def get_meshes (self):

    path = os.path.expanduser('~/seungmount/Omni/e2198_reconstruction/gallery/obj_museum/bc/')
    files = os.listdir(path)


    for filename in  files:
      print filename
      if ".obj" in filename:

        seg = filename.split('.obj')[0]
        ctm = seg + '.ctm'
        
        if not os.path.isfile('./mesh/'+ctm)  or os.path.getsize('./mesh/'+ctm) ==  0:
          self.convert_to_ctm(path,seg)

        # if ctm in files and os.path.getsize('./mesh/'+ctm) > 0:
        #   print 'removing ', seg  
        #   os.remove('./mesh/'+filename)

    #     else:

    #       if os.path.getsize('./mesh/'+filename) == 0:
    #         self.omni_export(seg)

    #       print 'converting', seg
    #       self.convert_to_ctm(seg)

    # spreadsheet  = Spreadsheet()
    # # for cell in spreadsheet.spreadsheet:
    # for seg in [20055]:
    #   # seg = cell['segments']
    #   ctm = str(seg) + '.ctm'


    #   if ctm in files and os.path.getsize('./mesh/'+ctm) > 0:
    #     continue

    #   self.omni_export(seg)
    #   self.convert_to_ctm(seg)

if __name__ == '__main__':
  
  m = Meshes()
  m.get_meshes()