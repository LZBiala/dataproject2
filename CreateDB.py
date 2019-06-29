import csv
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func


##### import the data tornado from the CSV file

tornadodataCSV = "resources/TornadoData.csv"
df = pd.read_csv(tornadodataCSV)


#Use SQLAlchemy create_engine to [create and] connect to your sqlite database.
engine = create_engine("sqlite:///Resources/tornadoDB.sqlite")

#append the data to the database
df.to_sql("tornadoDB", con = engine, if_exists='append', index=True)