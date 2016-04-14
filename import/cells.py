import csv
import re
import numpy
import os 

class Spreadsheet:

  def __init__(self):

    self.fname = "sheet.csv"

    self.spreadsheet = {}

    self.cell_classes = {}
    self.cell_types = {}

    self.loadSpreadsheet()


  def get(self):

    return self.spreadsheet

  def loadSpreadsheet(self):

    reader = csv.reader(open(self.fname,"rb"),delimiter=',')
    sheet = list(reader)

    for row_idx in range (1 , len(sheet)): #Skipe the heading of the csv

      self.processRow(sheet[row_idx])


  def processRow(self, row):

    r = {}
    r['segment_id'] = row[0]
    r['database_ids'] = row[1]
    r['seeds_ids'] = row[2]
    r['done_by'] = row[3]
    r['name'] = row[4]
    r['soma'] = row[5]
    r['cell_class'] = row[6]
    r['sublayer'] = row[7]
    r['on_off'] = row[8]
    r['cell_type'] = row[9]
    r['countdown_phase'] = row[10]
    r['countdown_zone'] = row[11] 
    r['notes'] = row[12]

    #If there is not segment_id it implies is an empty row
    # in the spreadsheet, we don't want to save it.
    if r['segment_id'] == '':
      return

    r = self.cleanRow(r)

    self.processClass(r)
    self.processType(r)

    self.spreadsheet[r['segment_id']] = r
    #delete removes redundant information
    del self.spreadsheet[r['segment_id']]['segment_id']


  def cleanRow(self, r):
    
    r['database_ids'] = re.findall(r"(\d+)", r['database_ids'])
    r['seeds_ids'] = re.findall(r"(\d+)", r['seeds_ids'])


    if r['name'] == '-':
      r['name'] = 'Cell # ' + r['segment_id']

    if r['cell_class'] == '' or r['cell_class'] == '??' or r['cell_class'] == '?' or r['cell_class'] == '-' :
      r['cell_class'] = 'unkown'

    if r['cell_type'] == '' or r['cell_type'] == '??' or r['cell_type'] == '?' or r['cell_type'] == '-' :
      r['cell_type'] = 'unkown'


    return r

  def processClass(self, r):

    if r['cell_class'] not in self.cell_classes:

      self.cell_classes[ r['cell_class'] ] = []

    if  r['cell_type'] not in self.cell_classes[ r['cell_class'] ]:

      self.cell_classes[ r['cell_class'] ].append( r['cell_type'] )


  def processType(self, r):

    if r['cell_type'] not in self.cell_types:

      self.cell_types[ r['cell_type'] ] = []

    if r['segment_id'] not in self.cell_types[ r['cell_type'] ]:

      self.cell_types[ r['cell_type'] ].append( r['segment_id'])





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
    
    for row_idx in range(mat.shape[0]):
      row = mat[row_idx][0] 
      if len(row) > 1: 
        values = []
        for t in row:
          if t[0] >= 0.0 and t[0] <= 100.0:
            values.append( t[1] )

        self.stratification[row_idx] = values


  def get(self):

    return self.stratification

if __name__ == '__main__':
  s = Stratification()
  print s.get()