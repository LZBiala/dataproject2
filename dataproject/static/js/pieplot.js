x_fscale = [];
y_1950 = [];
y_1960 = [];
y_1970 = [];
y_1980 = [];
y_1990 = [];
y_2000 = [];
y_2010 = [];
d3.json("/pie_chart").then((data)=>{
  console.log("i got here1");
  
 for (var i = 0; i < data.length;i++)
 {
  console.log("i got here2");
  x_fscale.push(data[i]["fscale"]);
  y_1950.push(data[i]["1950"]);
  y_1960.push(data[i]["1960"]);
  y_1970.push(data[i]["1970"]);
  y_1980.push(data[i]["1980"]);
  y_1990.push(data[i]["1990"]);
  y_2000.push(data[i]["2000"]);
  y_2010.push(data[i]["2010"]);
  console.log(`i got here3${data[i]["1950"]}`);
 }



var data_1 = [{
    values: y_1950,
    labels: x_fscale,
    domain: {column: 0},
    name: '1950',
    hoverinfo: 'label+percent+name',
    hole: .4,
    type: 'pie'
  },{
    values: y_2010,
    labels: x_fscale,
    text: 'Magnitude Percentage',
    textposition: 'inside',
    domain: {column: 1},
    name: '2010',
    hoverinfo: 'label+percent+name',
    hole: .4,
    type: 'pie'
  }];
  
  var layout = {
    title: 'Magnitude Percentage Shift 1950-2010',
    grid: {rows: 1, columns: 2},
    showlegend: true,
        annotations: [
      {
        font: {
          size: 14
        },
        showarrow: false,
        text: '1950',
        x: 0.20,
        y: 0.50
      },
      {
        font: {
          size: 14
        },
        showarrow: false,
        text: '2010',
        x: 0.8,
        y: 0.50
      }
    ]
  };
  
  console.log(`This is  the story${x_fscale}`)
  Plotly.newPlot("pie-plot", data_1, layout);
})