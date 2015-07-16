import csv
import re

class Cells:

  def __init__(self):

    self.fname = "sheet.csv"

    self.spreadsheet = {}

    self.loadSpreadsheet()

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

    self.cleanRow(r)

  def cleanRow(self, r):
    
    r['database_ids'] = re.findall(r"(\d+)", r['database_ids'])
    r['seeds_ids'] = re.findall(r"(\d+)", r['seeds_ids'])


    if r['name'] == '-':
      r['name'] = 'Cell # ' + r['segment_id']

    if r['cell_class'] == '' or r['cell_class'] == '??' or r['cell_class'] == '?' or r['cell_class'] == '-' :
      r['cell_class'] = 'unkown'

    if r['cell_type'] == '' or r['cell_type'] == '??' or r['cell_type'] == '?' or r['cell_type'] == '-' :
      r['cell_type'] = 'unkown'


    self.spreadsheet[r['segment_id']] = r

    #delete remove redundant information
    del self.spreadsheet[r['segment_id']]['segment_id']



if __name__ == '__main__':

  cells = Cells()
  print cells.spreadsheet
