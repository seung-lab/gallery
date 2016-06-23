import os
from cells import *

class Meshes:

  def __init__(self):
    pass

  def omni_export(self,segment):
    cmd ="/omniData/omni/backup/omni.omnify/omni.export --path /omniData/e2198_reconstruction/mesh.omni --segId "+str(segment)+" --mip 1 --resolution 17,17,24 --obj 2>/dev/null > ~/seungmount/research/Ignacio/alex/"+str(segment)+".obj"
    print cmd
    os.system(cmd)


  def convert_to_ctm(self,path ,segment, clean = True):
    if clean:  
      cmd = "meshlabserver -i "+path+str(segment)+".obj -s meshclean.mlx -o "+path+str(segment)+".ctm"
    else:
      cmd = "meshlabserver -i "+path+str(segment)+".obj -o "+path+str(segment)+".ctm"

    os.system(cmd)

  def get_meshes (self):

    path = os.path.expanduser('~/seungmount/research/Ignacio/mesh/')
    files = os.listdir(path)


    for filename in  files:
      if ".obj" in filename:

        print filename
        seg = filename.split('.obj')[0]
        ctm = seg + '.ctm'
        
        if not os.path.isfile(path+ctm)  or os.path.getsize(path+ctm) ==  0:
          self.convert_to_ctm(path,seg)

        if ctm in files and os.path.getsize(path+ctm) > 0:
          print 'removing ', seg  
          os.remove(path+filename)

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
  # for cell in [20179, 20125, 90001, 90002, 20014, 20016, 
  #             60004, 60048, 17161, 26158, 20137, 20239, 
  #             20210, 26094, 20254, 20233, 26178, 26137,
  #             26115, 26036, 26056, 26138, 26032, 25005,
  #             20096, 26165, 20213, 20220, 26084, 20245,
  #             17080, 26162, 26029, 26103, 26101, 26047, 20002]:
  #   print cell
    # m.omni_export(cell)    
  m.get_meshes()