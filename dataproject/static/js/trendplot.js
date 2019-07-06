x_decade = [];
y_fatalities = [];
y_injuries = [];
y_total_human_impact=[];
y_total_tornado_count=[];

d3.json("/trend_chart").then((data)=>{
  console.log("i got here1");
  
 for (var i = 0; i < data.length;i++)
 {
  console.log("i got here2");
  x_decade.push(data[i]["Decade"]);
  y_fatalities.push(data[i]["Total Fatalities"]);
  y_injuries.push(data[i]["Total Injuries"]);
  y_total_human_impact.push(data[i]["Total Human Impact"]);
  y_total_tornado_count.push(data[i]["Total Tornado Count"]);

  console.log(`i got here3${data[i]["Total Injuries"]}`);
 }
 var trace0 = {
  x: x_decade,
  y: y_total_human_impact,
  type: "scatter",
  name: "Total Human Impact"
  };
var trace1 = {
  x: x_decade,
  y: y_total_tornado_count,
  type: "scatter",
  yaxis: 'y2',
  name: "Total Tornado Count"
  
};



var data_1 = [trace0,trace1];

var layout = {
    title: 'Total Human Impact and Tornado Trends',
    yaxis: {title: 'Injuries + Fatalities'},
    yaxis2: {
      title: 'Tornado Count',
      titlefont: {color: 'rgb(148, 103, 189)'},
      tickfont: {color: 'rgb(148, 103, 189)'},
      overlaying: 'y',
      side: 'right'
    }
  };



console.log(`This is  the story${x_decade}`)
Plotly.newPlot("trend-plot", data_1, layout);
})//d3 end