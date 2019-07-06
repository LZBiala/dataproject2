function buildMetadata(year,state) {
  var greenIcon = L.icon({
    iconUrl: 'static/images/Tmain.png',
    //shadowUrl: 'static/images/Tshadow.png',

    iconSize:     [38, 95], // size of the icon
    //shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    //shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var locMarkers = [];
var lineMarkers = [];

  var url = `/metadata/${year}/${state}`;
  d3.json(url).then(function(data){
  
    for(var i = 0; i < data.length;i++)
    {
      locMarkers.push(
      L.marker([data[i]["startingLatitude"],data[i]["startingLongitude"]],{icon: greenIcon}).bindPopup("<h2>Magnitude: </h2><hr>" + 
      "<h3>" + data[i]["magnitude"] + "</h3><hr><h2>Date: </h2><hr>" +"<h3>" + data[i]["Date"] + "</h3>"));
      
      if((data[i]["endingLatitude"] != 0)&&(data[i]["endingLatitude"] != 0))
      {
        var latLngs = [[data[i]["startingLatitude"],data[i]["startingLongitude"]],
        [data[i]["endingLatitude"],data[i]["endingLongitude"]]];
        lineMarkers.push(L.polyline(latLngs, {color: 'red'}).bindPopup("<h2>Length(miles):<h2><hr>"+data[i]["Length"]));
      }
    }
    var locLayer = L.layerGroup(locMarkers);
    var lineLayer = L.layerGroup(lineMarkers);
    
    var overlayMaps = {Sites:locLayer,Travel:lineLayer};
    map.off();
    map.remove();
    map = L.map("map", {
      center: [37.0902, -95.7129],
      zoom: 4.5,
      layers:[streetLayer,locLayer,lineLayer]
    });
    L.control.layers(baseMaps, overlayMaps).addTo(map);
  });
  
}//end buildMetadata

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

var map = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 11
});


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
//############################################################################################
(function(){
  var width = 900;
  var height = 500;

  var svg = d3.select("#bubble")
  .append("svg")
  .attr("height",height)
  .attr("width",width)
  .append("g")
  .attr("transform","translate(0,0)")
/*
  <defs>
      <radialGradient id = "circleGradient">
        <stop offset="0%" stop-color="#F433FF" stop-opacity="1"></stop>
        <stop offset="100%" stop-color="#3DFF33" stop-opacity="1"></stop>
      </radialGradient>
  </defs>
*/
  var defs = svg.append("defs");

  defs.append("radialGradient")
  .attr("id","circleGradient")
  .append("stop")
  .attr("offset","0%")
  .attr("stop-color","#F433FF")
  .attr("stop-opacity","1")
  .append("stop")
  .attr("offset","100%")
  .attr("stop-color","#F433FF")
  .attr("stop-opacity","1");

  var radiusScale = d3.scaleSqrt().domain([34412,5806445665]).range([10,80])

  //simulation is a collection of forces detailing wheer we want our circles to go
  //and how we want them to interact
  //STEP ONE: Get them to the middle
  //STEP TWO: Don' have them collide
  var simulation = d3.forceSimulation()
      .force("x",d3.forceX(width / 2).strength(0.05))
      .force("y",d3.forceY(height / 2).strength(0.05))
      .force("collide",d3.forceCollide(function(d){
          return radiusScale(d.Amt) + 1;
      }))
/*
  d3.queue()
  .defer(d3.csv,"static/files/datapoints.csv")
  .await(ready)
*/
  d3.csv("static/files/datapoints.csv",function(error,data){
    if(error) return console.warn (error);
      defs.selectAll(".losses-gradient")
        .data(datapoints)
        .enter().append("radialGradient")
        .attr("class","losses-gradient")
        .attr("id",function(d){
            return d.Year
        })
        .append("stop")
        .attr("offset","0%")
        .attr("stop-color",function(d){
            return d.ColorHtml
        })
        .attr("stop-opacity","1")
        .append("stop")
        .attr("offset","100%")
        .attr("stop-color",function(d){
            return d.ColorHtml
        })
        .attr("stop-opacity","1");
      
      var circles = svg.selectAll(".losses")
      .data(datapoints)
      .enter().append("circle")
      .attr("class","losses")
      .attr("r",function(d){
          return radiusScale(d.Amt)
      })
      .attr("fill",function(d){
          return "url(#" + d.Year + ")"
      })
      .on('click',function(d){
          console.log(d)
      })
      
      simulation.nodes(datapoints)
          .on('tick',ticked)

      function ticked() {
          circles
              .attr("cx",function(d){
                  return d.x
              })

              .attr("cy",function(d){
                  return d.y
              })
      }

  });
  

/*
  function ready(error,datapoints) {
    console.log(datapoints);
      if(error) return console.warn (error);
      defs.selectAll(".losses-gradient")
        .data(datapoints)
        .enter().append("radialGradient")
        .attr("class","losses-gradient")
        .attr("id",function(d){
            return d.Year
        })
        .append("stop")
        .attr("offset","0%")
        .attr("stop-color",function(d){
            return d.ColorHtml
        })
        .attr("stop-opacity","1")
        .append("stop")
        .attr("offset","100%")
        .attr("stop-color",function(d){
            return d.ColorHtml
        })
        .attr("stop-opacity","1");
      
      var circles = svg.selectAll(".losses")
      .data(datapoints)
      .enter().append("circle")
      .attr("class","losses")
      .attr("r",function(d){
          return radiusScale(d.Amt)
      })
      .attr("fill",function(d){
          return "url(#" + d.Year + ")"
      })
      .on('click',function(d){
          console.log(d)
      })
      
      simulation.nodes(datapoints)
          .on('tick',ticked)

      function ticked() {
          circles
              .attr("cx",function(d){
                  return d.x
              })

              .attr("cy",function(d){
                  return d.y
              })
      }
  }
  */
}) ();