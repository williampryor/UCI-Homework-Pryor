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
  .attr("width", svgWidth + 5)
  .attr("height", svgHeight + 40);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//initial parameters

var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

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
        data.smokes = +data.smokes;
    });

    function xScale(healthData, chosenXAxis) {
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.9,
            d3.max(healthData, d => d[chosenXAxis]) * 1.1 ])
            .range([0, width]);

            return xLinearScale;
    }

    function yScale(healthData, chosenYAxis) {
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(healthData, d => d[chosenYAxis]) - 1,
            d3.max(healthData, d => d[chosenYAxis]) + 1])
            .range([height, 0]);

            return yLinearScale;
    }

    //declare the x and y scale variables
    var xLinearScale = xScale(healthData, chosenXAxis);
    var yLinearScale = yScale(healthData, chosenYAxis);

    //initialize the axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append x and y to the chart
    var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    var circleGroup = chartGroup.selectAll("g")
        .data(healthData)
        .enter()
        .append("g");

    var circles = circleGroup.append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .attr("fill", "blue")
        .attr("opacity", ".75")
        .classed("stateCircle", true);
    
    var circleText = circleGroup.append("text")
        .text(d => d.abbr)
        .attr("dx", d => xLinearScale(d[chosenXAxis]))
        .attr("dy", d => yLinearScale(d[chosenYAxis]))
        .classed("stateText", true);
    
    //Set up the axis labels and bind their variable names
    //to the corresponding data in the given dataset
    
    var xLabels = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height})`);

    var xPoverty = xLabels.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "poverty")
        .text("Poverty (%)")
        .classed("active", true);
    
    var xAge = xLabels.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "age")
        .text("Median Age")
        .classed("inactive", true);
    
    var xIncome = xLabels.append("text")
        .attr("x", 0)
        .attr("y", 80)
        .attr("value", "income")
        .text("Median Income")
        .classed("inactive", true);
    
    //y-axis labels

    var yLabels = chartGroup.append("g");

    var yHealthcare = yLabels.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", -50)
        .attr("value", "healthcare") //value to grab for event listener
        .text("Lacks Healthcare (%)")
        .classed("active", true);

    var ySmokes = yLabels.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", -70)
        .attr("value", "smokes")
        .text("Smokes (%)")
        .classed("active", true);

    var yObese = yLabels.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", -90)
        .attr("value", "obesity")
        .text("Obesity (%)")
        .classed("active", true);


    function renderXAxes(newX, xAxis) {
        var bottomAxis = d3.axisBottom(newX);

        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);

        return xAxis;
    }
    
    function renderYAxes(newY, yAxis) {
        var leftAxis = d3.axisLeft(newY);

        yAxis.transition()
            .duration(1000)
            .call(leftAxis);

        return yAxis;
    }

    function renderXCircles(circleGroup, newX, chosenXAxis) {
        circleGroup.transition()
            .duration(1000)
            .attr("cx", d => newX(d[chosenXAxis]));

            return circleGroup;
    }

    function renderYCircles(circleGroup, newY, chosenYAxis) {
        circleGroup.transition()
        .duration(1000)
        .attr("cy", d => newY([d(chosenYAxis)]));

        return circleGroup;
    }

    function renderXText(circleGroup, newX, chosenXAxis) {
        circleGroup.transition()
            .duration(1000)
            .attr("dx", d => newX(d[chosenXAxis]));

        return circleGroup;
    }

    function renderYText(circleGroup, newY, chosenYAxis) {
        circleGroup.transition()
            .duration(1000)
            .attr("dy", d => newY(d[chosenYAxis]));

        return circleGroup;
    }

    //define tooltip our updateToolTip function
    function updateToolTip(circleGroup, chosenXAxis, chosenYAxis) {
        var xPercent = ""
        var xLabel = ""

        if (chosenXAxis === "poverty") {
            xLabel = "Poverty";
            xPercent = "%";
        } 
        else if (chosenXAxis === "age"){
            xLabel = "Age";
        }
        else {
            xLabel = "Income";
        }

        var yPercent = ""
        var yLabel = ""

        if (chosenYAxis === "healthcare") {
            var yLabel = "Healthcare";
            yPercent = "%";
        }
        else if (chosenYAxis === "smokes") {
            yLabel = "Smokes";
            yPercent = "%";
        } else {
            yLabel = "Obesity";
            yPercent = "%";
        }

        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80, -60])
            .html(function(d) {
                
                    return (`${d.state}<br>${xLabel}: ${d[chosenXAxis]}${xPercent}
                    <br>${yLabel}: ${d[chosenYAxis]}${yPercent}`)
                
            })
        
        circleGroup.call(toolTip);

        circleGroup.on("mouseover", function(data) {
            toolTip.show(data);
        })

        circleGroup.on("mouseout", function(data) {
            toolTip.hide(data);
        });

        return circleGroup;
    }

    //update tooltips
    circleGroup = updateToolTip(circleGroup, chosenXAxis, chosenYAxis);

    //make function to change the x-axis when it is clicked

    xLabels.selectAll("text")
        .on("click", function() {
            var value = d3.select(this).attr("value");

        if (value !== chosenXAxis) {
            chosenXAxis = value;

        xLinearScale = xScale(healthData, chosenXAxis);

        xAxis = renderXAxes(xLinearScale, xAxis);
        
        circles = renderXCircles(circles, xLinearScale, chosenXAxis);

        circleText = renderXText(circleText, xLinearScale, chosenXAxis);

        circleGroup = updateToolTip(circleGroup, chosenXAxis, chosenYAxis);

        if (chosenXAxis === "age") {
            xPoverty
                .classed("active", false)
                .classed("inactive", true);
            xAge
                .classed("active", true)
                .classed("inactive", false);
            xIncome
                .classed("active", false)
                .classed("inactive", true); 
        }
        else if (chosenXAxis === "income") {
            xPoverty
                .classed("active", false)
                .classed("inactive", true);
            xAge
                .classed("active", false)
                .classed("inactive", true);
            xIncome
                .classed("active", true)
                .classed("inactive", false); 
            }

        else {
            xPoverty
                .classed("active", true)
                .classed("inactive", false);
            xAge
                .classed("active", false)
                .classed("inactive", true);
            xIncome
                .classed("active", false)
                .classed("inactive", true);
            }

        }
    });

    yLabels.selectAll("text")
        .on("click", function() {
            var value = d3.select(this).attr("value");

        if (value !== chosenYAxis) {
            chosenYAxis = value;

        yLinearScale = yScale(healthData, chosenYAxis);

        yAxis = renderYAxes(yLinearScale, yAxis);

        circles = renderYCircles(circles, yLinearScale, chosenYAxis);

        circleText = renderYText(circleText, yLinearScale, chosenYAxis);

        circleGroup = updateToolTip(circleGroup, chosenXAxis, chosenYAxis);

        if (chosenYAxis === "healthcare") {
            yHealthcare
                .classed("active", true)
                .classed("inactive", false);
            ySmokes
                .classed("active", false)
                .classed("inactive", true);
            yObese
                .classed("active", false)
                .classed("inactive", true); 
        }
        else if (chosenYAxis === "smokes") {
            yHealthcare
                .classed("active", false)
                .classed("inactive", true);
            ySmokes
                .classed("active", true)
                .classed("inactive", false);
            yObese
                .classed("active", false)
                .classed("inactive", true); 
            }

        else {
            yHealthcare
                .classed("active", false)
                .classed("inactive", true);
            ySmokes
                .classed("active", false)
                .classed("inactive", true);
            yObese
                .classed("active", true)
                .classed("inactive", false);
            }

        }
    });

}).catch(function(error) {
    console.log(error);
});
