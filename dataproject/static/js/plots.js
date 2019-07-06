x_decade = [];
y_fscale_0 = [];
y_fscale_1 = [];
y_fscale_2 = [];
y_fscale_3 = [];
y_fscale_4 = [];
y_fscale_5 = [];
d3.json("/chart").then((data)=>{
  console.log("i got here1");
  
 for (var i = 0; i < data.length;i++)
 {
  console.log("i got here2");
  x_decade.push(data[i]["X"]);
  y_fscale_0.push(data[i]["Y0"]);
  y_fscale_1.push(data[i]["Y1"]);
  y_fscale_2.push(data[i]["Y2"]);
  y_fscale_3.push(data[i]["Y3"]);
  y_fscale_4.push(data[i]["Y4"]);
  y_fscale_5.push(data[i]["Y5"]);
  console.log(`i got here3${data[i]["Y4"]}`);
 }
 var trace0 = {
  x: x_decade,
  y: y_fscale_0,
  name: "F Scale 0",
  type: "bar"


};
var trace1 = {
  x: x_decade,
  y: y_fscale_1,
  name: "F Scale 1",
  type: "bar",
 
};
var trace2 = {
  x: x_decade,
  y: y_fscale_2,
  name: "F Scale 2",
  type: "bar"
};
var trace3 = {
  x: x_decade,
  y: y_fscale_3,
  name: "F Scale 3",
  type: "bar"
};
var trace4 = {
  x: x_decade,
  y: y_fscale_4,
  name: "F Scale 4",
  type: "bar"
};
var trace5 = {
  x: x_decade,
  y: y_fscale_5,
  name: "F Scale 5",
  type: "bar"
};

var data_1 = [trace0,trace1,trace2,trace3,trace4,trace5];

var layout = {
  title: "Frequency of Tornadoes By Magnitude",
  xaxis: { title: "Decade" },
  yaxis: { title: "Frequency" },
  barmode: 'group'
};

console.log(`This is the story${x_decade}`)
Plotly.newPlot("bar-plot", data_1, layout);
})