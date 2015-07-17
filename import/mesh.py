import os
from cells import *

class Meshes:

  def __init__(self):
    pass

  def omni_export(segment):
    cmd ="/omniData/omni/omni.omnify/omni.export --path /omniData/e2198_reconstruction/mesh.omni --segId "+str(segment)+" --mip 1 --resolution 17,17,24 --obj 2>/dev/null > mesh/"+str(segment)+".obj"
    print cmd
    os.system(cmd)


  def convert_to_ctm(segment, clean = True):
    if clean:  
      cmd = "meshlabserver -i mesh/"+str(segment)+".obj -s meshclean.mlx -o mesh/"+str(segment)+".ctm"
    else:
      cmd = "meshlabserver -i mesh/"+str(segment)+".obj -o mesh/"+str(segment)+".ctm"

    os.system(cmd)

  def get_meshes ():

    files = os.listdir('./mesh')


    for filename in  files:

      if ".obj" in filename:

        seg = filename.split('.obj')[0]
        ctm = seg + '.ctm'


        if ctm in files and os.path.getsize('./mesh/'+ctm) > 0:
          print 'removing ', seg  
          os.remove('./mesh/'+filename)

        else:

          if os.path.getsize('./mesh/'+filename) == 0:
            omni_export(seg)

          print 'converting', seg
          convert_to_ctm(seg)

    spreadsheet  = Spreadsheet()
    for cell in spreadsheet.spreadsheet:
      seg = cell['segment']
      ctm = str(seg) + '.ctm'


      if ctm in files and os.path.getsize('./mesh/'+ctm) > 0:
        continue

      omni_export(seg)
      convert_to_ctm(seg)

if __name__ == '__main__':
  get_meshes()