//Set up chart

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Create SVG wrapper and apend an SVG group to hold the chart
//and shift the latter by left and top margins

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight + 40);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//initial parameters

var chosenXAxis = "healthcare";

//Import the data from data.csv

d3.csv("assets/data/data.csv").then(function(healthData) {
    //format the data from the data.csv:
    //id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,healthcare,
    //healthcareLow,healthcareHigh,
    //obesity,obesityLow,obesityHigh,smokes,smokesLow,smokesHigh

    //start by adding the data corresponding to healthcare vs. poverty
    
    healthData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.obesity = +data.obesity;
    });

    //Create function for updating x-scale var upon click on axis label

        function xScale(healthData, chosenXAxis) {
            var xLinearScale = d3.scaleLinear()
            .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
                d3.max(healthData, d => d[chosenXAxis]) * 1.2
            ])
            .range([0, width]);
            return xLinearScale;
        }

        //function for updating xAxis var on click
        function renderAxes(newXScale, xAxis) {
            var bottomAxis = d3.axisBottom(newXScale);
        
            xAxis.transition()
            .duration(1000)
            .call(bottomAxis);
        
            return xAxis;
        }

        //function for updating circles with a transition to new circles

        function renderCircles(circlesGroup, newXScale, chosenXAxis) {
            
            circlesGroup.transition()
                .duration(1000)
                .attr("cx", d => newXScale(d[chosenXAxis]));

            return circlesGroup;
        }

        //Axes Labels

        //function used for updating circles group with new tooltip

        function updateToolTip(chosenXAxis, circlesGroup) {
            
            var label;

            if (chosenXAxis === "healthcare") {
                label = "Health Care";
            }
            else {
                label = "Poverty Amount"
            }

            var toolTip = d3.tip()
                .attr("class", "tooltip")
                .offset([80, -60])
                .html(function(d) {
                return(`${d.abbr}<br>${label} ${d[chosenXAxis]}`);
            });

            circlesGroup.on("mouseover", function(data) {
                toolTip.show(data);
            })
            //mouseout event
            .on("mouseout", function(data, index) {
                toolTip.hide(data);
            });

            return circlesGroup;
        }

    var xLinearScale = xScale(healthData, chosenXAxis);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.healthcare)])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append x-axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    //append y-axis
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.poverty))
        .attr("r", 20)
        .attr("fill", "blue")
        .attr("opacity", ".5");

    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var healthcareLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 50)
        .attr("value", "healthcare")
        .classed("inactive", true)
        .text("Healthcare Amount")

    var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "poverty") // value to grab for event listener
    .classed("inactive", true)
    .text("Poverty Amount");

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Poverty Amount");

    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    labelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = value;

            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(healthData, chosenXAxis);

            // updates x axis with transition
            xAxis = renderAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        }})}).catch(function(error) {
            console.log(error);
        });
