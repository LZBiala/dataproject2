import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

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

# Save references to each table
Samples_Metadata = Base.classes.tornadoDB
#Samples = Base.classes.samples


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("maps.html")


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
    #for result in results:
        #yearList.append(result)
    return jsonify(rsltObjct)
    # Use Pandas to perform the sql query
    #stmt = db.session.query(Samples).statement
    #df = pd.read_sql_query(stmt, db.session.bind)

    # Return a list of the column names (sample names)
    #return jsonify(list(df.columns)[2:])


@app.route("/metadata/<year>/<state>")
def sample_metadata(year,state):
    """Return the MetaData for a given sample."""
    print("i got here")
    sel = [
        Samples_Metadata.Year,
        Samples_Metadata.State,
        Samples_Metadata.Magnitude,
        Samples_Metadata.StartingLatitude,
        Samples_Metadata.StartingLongitude,
        Samples_Metadata.EndingLatitude,
        Samples_Metadata.EndingLongitude,
        Samples_Metadata.TornadoNumber,
    ]

    # results = db.session.query(*sel).filter(Samples_Metadata.sample == sample).all()
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
        sample_metadata_dict["TornadoNumber"] = result[7]
        sample_metadata_list.append(sample_metadata_dict)
    print(sample_metadata_list)
    return jsonify(sample_metadata_list)


@app.route("/samples/<sample>")
def samples(sample):
    """Return `otu_ids`, `otu_labels`,and `sample_values`."""
    stmt = db.session.query(Samples).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Filter the data based on the sample number and
    # only keep rows with values above 1
    sample_data = df.loc[df[sample] > 1, ["otu_id", "otu_label", sample]]

    # Sort by sample
    sample_data.sort_values(by=sample, ascending=False, inplace=True)

    # Format the data to send as json
    data = {
        "otu_ids": sample_data.otu_id.values.tolist(),
        "sample_values": sample_data[sample].values.tolist(),
        "otu_labels": sample_data.otu_label.tolist(),
    }
    return jsonify(data)

if __name__ == "__main__":
    app.run()
