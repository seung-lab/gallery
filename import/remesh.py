import os

#missing 20001 20003 20004 20007 20008 20009 20010 20013 20015 20017 20018 20022 20023 20025 20026 20028 20030 20031 20032 20033
for segment in [20079, 20091, 20149,  20162, 20176, 20180, 20185, 20188, 20189, 20216]:

  cmd = "meshlabserver -i mesh/"+str(segment)+".ctm -s remesh.mlx -o mesh/"+str(segment)+".ctm"
  os.system(cmd)