import os

for segment in [20262]:

  cmd = "meshlabserver -i mesh/"+str(segment)+".ctm -s remesh.mlx -o mesh/"+str(segment)+".ctm"
  os.system(cmd)