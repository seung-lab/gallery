import os

def convert_to_ctm(segment):
  cmd = "meshlabserver -i mesh/"+str(segment)+".obj -s meshclean.mlx -o mesh/"+str(segment)+".ctm"
  os.system(cmd)


files = os.listdir('./mesh')

for filename in  files:

  if ".obj" in filename:
    seg = filename.split('.obj')[0]

    ctm = seg + '.ctm'

    if ctm in files:
      print 'removing ', seg
      os.remove('./mesh/'+filename)

    # else:
    #   print 'not removing ', seg
    #   convert_to_ctm(seg)

