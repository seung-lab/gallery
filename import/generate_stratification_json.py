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

    mat = mat['strat']
  

    for row_idx in range(mat.shape[0]):
      row = mat[row_idx]

      segId = str(row[0].flatten()[0])
      values = list(row[1].flatten())

      self.stratification[segId] = values


  def get(self):

    return self.stratification


if __name__ == '__main__':
  # full_strat = Stratification()
  mono_strat = Stratification()
  
  # for segment_id in full_strat.stratification:
  #   if segment_id in  mono_strat.stratification:

  #     full_strat.stratification[segment_id] = mono_strat.stratification
