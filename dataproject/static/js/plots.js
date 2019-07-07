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
<<<<<<< HEAD
  type: "bar",
  name: "fscale 0"
=======
  name: "F Scale 0",
  type: "bar"


>>>>>>> c1dc757795f014c4c24ca12f18300be36998474d
};
var trace1 = {
  x: x_decade,
  y: y_fscale_1,
  name: "F Scale 1",
  type: "bar",
  name: "fscale 1"
 
};
var trace2 = {
  x: x_decade,
  y: y_fscale_2,
<<<<<<< HEAD
  type: "bar",
  name: "fscale 2"

=======
  name: "F Scale 2",
  type: "bar"
>>>>>>> c1dc757795f014c4c24ca12f18300be36998474d
};
var trace3 = {
  x: x_decade,
  y: y_fscale_3,
<<<<<<< HEAD
  type: "bar",
  name: "fscale 3"
=======
  name: "F Scale 3",
  type: "bar"
>>>>>>> c1dc757795f014c4c24ca12f18300be36998474d
};
var trace4 = {
  x: x_decade,
  y: y_fscale_4,
<<<<<<< HEAD
  type: "bar",
  name: "fscale 4"
=======
  name: "F Scale 4",
  type: "bar"
>>>>>>> c1dc757795f014c4c24ca12f18300be36998474d
};
var trace5 = {
  x: x_decade,
  y: y_fscale_5,
<<<<<<< HEAD
  type: "bar",
  name: "fscale 5"
=======
  name: "F Scale 5",
  type: "bar"
>>>>>>> c1dc757795f014c4c24ca12f18300be36998474d
};

var data_1 = [trace0,trace1,trace2,trace3,trace4,trace5];

var layout = {
  title: "Frequency of Tornadoes By Magnitude",
  xaxis: { title: "Decade" },
<<<<<<< HEAD
  yaxis: { title: "Frequency of Tornadoes by Magnitude" },
=======
  yaxis: { title: "Frequency" },
>>>>>>> c1dc757795f014c4c24ca12f18300be36998474d
  barmode: 'group'
};

console.log(`This is the story${x_decade}`)
Plotly.newPlot("bar-plot", data_1, layout);
})