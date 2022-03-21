import csv
from operator import indexOf

months = ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]

data = []

# read csv data
with open('seasonal_calendar.csv', 'r') as csv_file:
    reader = csv.reader(csv_file)
    for row in reader:
        data.append(row)
        
# create sql statements
sql =  "INSERT INTO table_name (name, season_start, season_end)\nVALUES"

for ingredient in data:
  name = ingredient[0]
  try:
    start_season = indexOf(months, ingredient[1])
    end_season = indexOf(months, ingredient[2])
  except:
    print("Could not resolve month for " + ingredient)
    exit(-1)
  
  sql += "('%s', '%i', '%i')\n" % (name, start_season, end_season)

# write sql statement to file
textfile = open("seasonal_calendar.sql", "w")
a = textfile.write(sql)
textfile.close()
