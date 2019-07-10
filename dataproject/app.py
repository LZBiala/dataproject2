import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func


import matplotlib
import matplotlib.pyplot as plt
import numpy as np

import plotly.plotly as py
import plotly.graph_objs as go



app = Flask(__name__)

#################################################
# Database Setup
#################################################


app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/tornadoDB.sqlite"
db = SQLAlchemy(app)



# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)


# Save reference to the tables
# Barchart table for barchart of frequency of tornadoes by magnitude
Bar_Chart = Base.classes.barchartDB
# Pie Chart for the percentage of magnitude type by decade
Pie_Chart = Base.classes.pie_chart
# Trend chart to show trend of human impact of tornado along with trend of frequency
Human_Impact = Base.classes.barchart_total_fat_count

##Setting up references to tables applicable to maps made by chike dez raphael
Samples_Metadata = Base.classes.tornadoDB

############################################
# Routes
############################################

# Render index page
@app.route("/")
def jam():
    return render_template("index.html")

# Render map page
@app.route("/maps")
def mapsRoute():
    return render_template("maps.html")



#route to jsonified data for barchart
#-----------------------------------------------------------------------------------------------------------------------------------------
@app.route("/chart")

def barchart():
    decade = [
        Bar_Chart.Decade,
        Bar_Chart.fscale0,
        Bar_Chart.fscale1,
        Bar_Chart.fscale2,
        Bar_Chart.fscale3,
        Bar_Chart.fscale4,
        Bar_Chart.fscale5,
    ]
    results = db.session.query(*decade).all()

    my_list = []

    for result in results:
        my_dict = {}
        my_dict["X"] = result[0]
        my_dict["Y0"] = result[1]
        my_dict["Y1"] = result[2]
        my_dict["Y2"] = result[3]
        my_dict["Y3"] = result[4]
        my_dict["Y4"] = result[5]
        my_dict["Y5"] = result[6]
        my_list.append(my_dict)

    return jsonify(my_list)


    

#--------------------------------------------------------------------------------------------------------------------------------------

# route to jsonified data to pie chart
@app.route("/pie_chart")

def piechart():
    pie = [
        Pie_Chart.fscale,
        Pie_Chart.Decade1950,
        Pie_Chart.Decade1960,
        Pie_Chart.Decade1970,
        Pie_Chart.Decade1980,
        Pie_Chart.Decade1990,
        Pie_Chart.Decade2000,
        Pie_Chart.Decade2010,
    ]
    results = db.session.query(*pie).all()

    pie_list = []

    for result in results:
        my_pie_chart = {}
        my_pie_chart["fscale"] = result[0]
        my_pie_chart["1950"] = result[1]
        my_pie_chart["1960"] = result[2]
        my_pie_chart["1970"] = result[3]
        my_pie_chart["1980"] = result[4]
        my_pie_chart["1990"] = result[5]
        my_pie_chart["2000"] = result[6]
        my_pie_chart["2010"] = result[7]
        pie_list.append(my_pie_chart)

    return jsonify(pie_list)
#----------------------------------------------------------------------------------------------------------------------------------------

# route to jsonified data to trend chart
@app.route("/trend_chart")

def trendchart():
    trend = [
        Human_Impact.Decade,
        Human_Impact.total_fatalies,
        Human_Impact.total_injuries,
        Human_Impact.total_human_impact,
        Human_Impact.total_tornado_count,
    ]
    results = db.session.query(*trend).all()

    trend_list = []

    for result in results:
        human_chart = {}
        human_chart["Decade"] = result[0]
        human_chart["Total Fatalities"] = result[1]
        human_chart["Total Injuries"] = result[2]
        human_chart["Total Human Impact"] = result[3]
        human_chart["Total Tornado Count"] = result[4]
        trend_list.append(human_chart)

    return jsonify(trend_list)

#--------------------------------------------------------------------------------------------
# GeoJson Map routes - Dez, Chike, Rafael, If need to work on map, please make changes to this block for map 

# This route populates the year and state dropdown boxes
@app.route("/names")
def names():
    """Return a list of sample names."""
    yearSel = [Samples_Metadata.Year]
    yearRslts = db.session.query(*yearSel).distinct().all()

    stateSel = [Samples_Metadata.State]
    stateRslts = db.session.query(*stateSel).distinct().all()
    rsltObjct = {}
    rsltObjct["Years"] = yearRslts
    rsltObjct["States"] = stateRslts
    return jsonify(rsltObjct)

# This route returns tornado data from the database for a given year and a given state    
@app.route("/metadata/<year>/<state>")
def sample_metadata(year,state):
    """Return the MetaData for a given year and state."""
    print("i got here")
    sel = [
        Samples_Metadata.Year,
        Samples_Metadata.State,
        Samples_Metadata.Magnitude,
        Samples_Metadata.StartingLatitude,
        Samples_Metadata.StartingLongitude,
        Samples_Metadata.EndingLatitude,
        Samples_Metadata.EndingLongitude,
        Samples_Metadata.LengthMiles,
        Samples_Metadata.Date,
        Samples_Metadata.Time,
        Samples_Metadata.TimeZone,
    ]

    results = db.session.query(*sel).filter(Samples_Metadata.State == state).filter(Samples_Metadata.Year == year).all()

    # Create a dictionary entry for each row of metadata information
    sample_metadata_list = []
    for result in results:
        sample_metadata_dict = {}
        sample_metadata_dict["year"] = result[0]
        sample_metadata_dict["state"] = result[1]
        sample_metadata_dict["magnitude"] = result[2]
        sample_metadata_dict["startingLatitude"] = result[3]
        sample_metadata_dict["startingLongitude"] = result[4]
        sample_metadata_dict["endingLatitude"] = result[5]
        sample_metadata_dict["endingLongitude"] = result[6]
        sample_metadata_dict["Length"] = result[7]
        sample_metadata_dict["Date"] = result[8]
        sample_metadata_dict["Time"] = result[9]
        sample_metadata_dict["TimeZone"] = result[10]
        sample_metadata_list.append(sample_metadata_dict)
    print(sample_metadata_list)
    return jsonify(sample_metadata_list)

# This route returns data to be used in making the force bubbles
@app.route("/decadeBubble")
def Bubbles():
    sel = [
        Samples_Metadata.Year,
        Samples_Metadata.EstimatedMinLossUSD,
        Samples_Metadata.EstimatedMaxLossUSD,
    ]
    """Return `otu_ids`, `otu_labels`,and `sample_values`."""
    results = db.session.query( Samples_Metadata.Year,func.sum(((Samples_Metadata.EstimatedMinLossUSD + Samples_Metadata.EstimatedMaxLossUSD)/2))).group_by(Samples_Metadata.Year).all()
    decadeList = []
    for result in results:
        decadeDict  = {}
        if(result[0] >= 1950 and result[0] <=1959):
            decadeDict["Decade"] = 1950
            decadeDict["Color"] = "#04B404"
        elif(result[0] >= 1960 and result[0] <=1969):
            decadeDict["Decade"] = 1960
            decadeDict["Color"] = "#0040FF"
        elif(result[0] >= 1970 and result[0] <=1979):
            decadeDict["Decade"] = 1970
            decadeDict["Color"] = "#2ECCFA"
        elif(result[0] >= 1980 and result[0] <=1989):
            decadeDict["Decade"] = 1980
            decadeDict["Color"] = "#8258FA"
        elif(result[0] >= 1990 and result[0] <=1999):
            decadeDict["Decade"] = 1990
            decadeDict["Color"] = "#F781F3"
        elif(result[0] >= 2000 and result[0] <=2009):
            decadeDict["Decade"] = 2000
            decadeDict["Color"] = "#DBA901"
        else:
            decadeDict["Decade"] = 2010
            decadeDict["Color"] = "#FE2E2E"
        decadeDict["Year"] = result[0]
        decadeDict["Amt"] = result[1]
        decadeList.append(decadeDict)
    return jsonify(decadeList)


if __name__ == "__main__":
    app.run()