//Set up chart

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Create SVG wrapper and apend an SVG group to hold the chart
//and shift the latter by left and top margins

var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Import the data from data.csv

d3.csv("data.csv").then(function(healthData) {
    //format the data from the data.csv:
    //id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,healthcare,
    //healthcareLow,healthcareHigh,
    //obesity,obesityLow,obesityHigh,smokes,smokesLow,smokesHigh

    //start by adding the data corresponding to healthcare vs. poverty
    
    healthData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    //Create scale functions

    var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, h => h.healthcare)])
        .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, h => h.poverty)]
        .range([height, 0]);

    var xAxis1 = d3.axisbottom(xLinearScale);
    var yAxis1 = d3.axisLeft(yLinearScale);
        
        //Append Axes to the chart
        
    chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis1);
        
    chartGroup.append("g")
            .call(yAxis1);
    
    //Make the circles

    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", h => xLinearScale(h.healthcare))
        .attr("cy", h => yLinearScale(h.poverty))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".5");

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(h) {
            return(`${h.abbr}<br>Healthcare: ${h.healthcare}<br>Poverty: ${h.poverty}`);
        });

    chartGroup.call(toolTip);

    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
    })

    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    //Axes Labels

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Poverty Amount");
    
    chartGroup.append("text")
        .attr("transform", `translate(${width/2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Healthcare Amount");
        
}).catch(function(error) {
    console.log(error);
});
