function buildMetadata(year,state) {
  var greenIcon = L.icon({
    iconUrl: '../images/Tmain.png',
    shadowUrl: '../images/Tshadow.png',

    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var locMarkers = [];
  var url = `/metadata/${year}/${state}`;
  d3.json(url).then(function(data){
  
    for(var i = 0; i < data.length;i++)
    {
      //var latLngs = [[data[i]["startingLatitude"],data[i]["startingLongitude"]],
      //[data[i]["endingLatitude"],data[i]["endingLongitude"]]];
      //var polyline = L.polyline(latLngs, {color: 'red'}).addTo(map);
      locMarkers.push(
      L.marker([data[i]["startingLatitude"],data[i]["startingLongitude"]]).bindPopup("<h2>Magnitude: </h2><hr>" + 
      "<h3>" + data[i]["magnitude"] + "</h3>"));
      //L.marker([data[i]["endingLatitude"],data[i]["endingLongitude"]],{icon: greenIcon}).addTo(map);
    }
    var locLayer = L.layerGroup(locMarkers);

    var overlayMaps = {Sites:locLayer};
    
    var map = new L.map("map", {
      center: [37.0902, -95.7129],
      zoom: 11,
      layers:[streetLayer,locLayer]
    });
    L.control.layers(baseMaps, overlayMaps).addTo(map);
  });
  
}//end buildMetadara

function buildCharts(sample) {
  console.log("Build new chart");

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  
  // Grab a reference to the dropdown select element
  var yearSelector = d3.select("#selDataset");
  var stateSelector = d3.select("#selState");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames["Years"].forEach((sample) => {
      yearSelector
        .append("option")
        .text(sample[0])
        .property("value", sample[0]);
    });

    sampleNames["States"].forEach((sample) => {
      stateSelector
        .append("option")
        .text(sample[0])
        .property("value", sample[0]);
    });

    // Use the first sample from the list to build the initial plots
    //const firstSample = sampleNames[0];
    //buildCharts(firstSample);
    buildMetadata(sampleNames["Years"][0][0],sampleNames["States"][0][0]);
  });
}

function yearChanged(newYear) {
  var curState = d3.select("#selState").property("value");
  // Fetch new data each time a new sample is selected
  //buildCharts(newSample);
  buildMetadata(newYear,curState);
}

function stateChanged(newState) {
  var curYear = d3.select("#selDataset").property("value");
  // Fetch new data each time a new sample is selected
  //buildCharts(newSample);
  buildMetadata(curYear,newState);
}
/*
var map = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 11,
  layers:[streetLayer,locLayer]
});
*/

// Adding tile layer
var streetLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

var darkLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

var baseMaps = {
  Street: streetLayer,
  Dark: darkLayer
};

// Initialize the dashboard
init();
