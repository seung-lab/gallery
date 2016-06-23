import csv
import re
import numpy
import os 
import scipy.io

class Stratification:

  def __init__(self, fname = 'strat.mat'):

    self.fname =  os.path.expanduser(fname)
    self.stratification = {}
    self.loadStratification()

  def loadStratification(self):

    mat = scipy.io.loadmat(self.fname);
    filename =  os.path.basename(self.fname)
    dataset_name = filename.split('.')[0]
    mat = mat[dataset_name]
    
    import pprint
    pp = pprint.PrettyPrinter(indent=4, depth=1)
    pp.pprint(mat)
    for row_idx in range(mat.shape[0]):
      row = mat[row_idx][0] 
      if len(row) > 1: 
        values = []
        for t in row:
          if t[0] >= 0.0 and t[0] <= 100.0:
            values.append( t[1] )

        self.stratification[row_idx+1] = values


  def get(self):

    return self.stratification

if __name__ == '__main__':
  s = Stratification()
  import matplotlib.pyplot as plt

  line = s.get()[20156]
  plt.plot(line)
  plt.show()
  # 17188 17079 20156 26004