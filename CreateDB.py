import csv
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func


##### import the data tornado from the CSV file

##tornadodataCSV = "resources/TornadoData.csv"
tornadodataCSV = "resources/TornadoDataWithDecadesAverages.csv"
df = pd.read_csv(tornadodataCSV)


#Use SQLAlchemy create_engine to [create and] connect to your sqlite database.
engine = create_engine("sqlite:///Resources/tornadoDB.sqlite")


try:
    #this will fail if there is a new column
    #append the data to the database
    df.to_sql(name='tornadoDB', con= engine, if_exists = 'append', index= False)
except:
    #this will update
    data = pd.read_sql('SELECT * FROM tornadoDB', engine)
    df.to_sql(name='tornadoDB', con=engine, if_exists = 'replace', index= False)