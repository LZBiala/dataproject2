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

    var radiusScale = d3.scaleSqrt().domain([1,300]).range([10,80])

    //simulation is a collection of forces detailing wheer we want our circles to go
    //and how we want them to interact
    //STEP ONE: Get them to the middle
    //STEP TWO: Don' have them collide
    var simulation = d3.forcesimulation()
        .force("x",d3.forceX(width / 2).strength(0.05))
        .force("y",d3.forceY(height / 2).strength(0.05))
        .force("collide",d3.forceCollide(function(d){
            return radiusScale(d.Amt) + 1;
        }))

    d3.queue()
    .defer(d3.csv,"static/files/Losses.csv")
    .await(ready)

    function ready(error,datapoints) {

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
              return d.Color
          })
          .attr("stop-opacity","1")
          .append("stop")
          .attr("offset","100%")
          .attr("stop-color",function(d){
              return d.color
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
}) ();