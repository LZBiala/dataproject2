//Creator: Chike Uduku
//Created: 07/05/2019
//Desc: This function creates the custom tornado icon
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

var locMarkers = []; //Array to house markers for tornade latitude and longitude coordinates
var lineMarkers = []; //Array to house plolylines reflecting path traveled by tornado

//get jsonified data for a given year and state
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
  
}//end buildMetadara

//initialize plot with markers ofr first state and year in respective dropdown menus
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

//Creator: Chike uduku
//Created: 05/07/2019
//Desc: This fucntion is called when the value in the year dropdown menu changes
function yearChanged(newYear) {
  var curState = d3.select("#selState").property("value");
  buildMetadata(newYear,curState);
}

//Creator: Chike uduku
//Created: 05/07/2019
//Desc: This fucntion is called when the value in the state dropdown menu changes
function stateChanged(newState) {
  var curYear = d3.select("#selDataset").property("value");
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

//#########################################################################################################################
//                              FORCE BUBBLES
//########################################################################################################################
(function(){
  var width = 900;
  var height = 900;

  //get designated dive for force bubles and apend an svg element to  it
  var svg = d3.select("#bubble")
  .append("svg")
  .attr("height",height)
  .attr("width",width)
  .append("g")
  .attr("transform","translate(0,0)")

  var defs = svg.append("defs");

  //append definitions
  defs.append("linearGradient")
  .attr("id","circleGradient")
  .append("stop")
  .attr("offset","100%")
  .attr("stop-color","#F433FF");
  
//define radius scale based on minimum and maximum property loss amount
  var radiusScale = d3.scaleSqrt().domain([34412,5806445665]).range([10,80])

  //simulation is a collection of forces detailing where we want our circles to go and how we want
  //them to interact
  //STEP ONE: get them to the middle
  //STEP TWO: don't have them collide!
  var forceXSeparate = d3.forceX(function(d){
    var j = width / 2;
    if((d.Decade >= 1950 && d.Decade <= 1960)||(d.Decade >= 1990 && d.Decade <= 2000))
    {
      j = 250;
    }
    else if((d.Decade >= 1970 && d.Decade <= 1980)||(d.Decade >= 2010))
    {
      j = 750;
    }
    return j;
  }).strength(0.05)

  var forceYSeparate = d3.forceY(function(d){
    var j = height / 2;
    if((d.Decade >= 1950 && d.Decade <= 1960)||(d.Decade >= 1970 && d.Decade <= 1980))
    {
      j = 250;
    }
    else if((d.Decade >= 1990 && d.Decade <= 2000)||(d.Decade >= 2010))
    {
      j = 750;
    }
    return j;
  }).strength(0.05)

  var forceXCombine = d3.forceX(function(d){
    return width / 2
  }).strength(0.05)

  var forceYCombine = d3.forceY(function(d){
    return height / 2
  }).strength(0.05)

  var forceCollide = d3.forceCollide(function(d){
    return radiusScale(d.Amt) + 1
  })

  var simulation = d3.forceSimulation()
    .force("x",forceXCombine)
    .force("y",forceYCombine)
    .force("collide",forceCollide)

    //get monetary loss amount as wel as designated decade for each year
  d3.json("/decadeBubble").then(function(myData){

    //convert amount and decade values to numerical values
    myData.forEach(function(data) {
      data.Amt = +data.Amt;
      data.Decade = +data.Decade;
    });
  
    //append definitions for circles to be drawn
    defs.selectAll(".losses-gradient")
        .data(myData)
        .enter().append("linearGradient")
        .attr("class","losses-gradient")
        .attr("id",function(d){
          return d.Year
        })
        .append("stop")
        .attr("offset","100%")
        .attr("stop-color",function(d){
          return d.Color
        });
        
    // Define the div for the tooltip
    var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
    
    //draw circles whose radius is based on amount of monetary loss. Color cirlces based on what decade that year belongs to
    var circles = svg.selectAll(".losses")
      .data(myData)
      .enter().append("circle")
      .attr("class","losses")
      .attr("r",function(d){
        return radiusScale(d.Amt)
      })
      .attr("fill",function(d){
        return "url(#" + d.Year + ")"
      })
      .on('click',function(d){
        console.log(d);
      })
      .on('mouseover',function(d){
        div.transition()
          .duration(500)
          .style("opacity",.9);
        div.html(`<strong>${d.Year}<strong><hr>${d.Amt} estimated loss`)
          .style("left", (d3.event.pageX) + "px")		
          .style("top", (d3.event.pageY - 28) + "px");;
      })
      .on('mouseout',function(d){
        div.transition()
          .duration(500)
          .style("opacity",0);
      })

      //Event for separating bubbles based on decade
      d3.select("#decade").on('click',function(d){
        simulation
          .force("x",forceXSeparate)
          .force("y",forceYSeparate)
          .alphaTarget(0.5)
          .restart()
      })
      //Event for recombining bubbles
      d3.select("#combine").on('click',function(d){
        simulation
          .force("x",forceXCombine)
          .force("y",forceYCombine)
          .alphaTarget(0.5)
          .restart()
      })
      
      simulation.nodes(myData)
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
  });//end d3.json bubbles
  

  
}) ();