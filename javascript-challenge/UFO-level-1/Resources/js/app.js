// from data.js
var tableData = data;

//reference for the table body
var tbody = d3.select("tbody");

//log our output so far to the console to see the raw data table in the console
console.log(data);

//Loop through 'data' and log each object to the console

data.forEach(function(dataObject) {
    console.log(dataObject);
});

//Use d3 to append one table row "tr" for each object in "data"

data.forEach(function(dataObject) {
    console.log(dataObject);
    var row = tbody.append("tr");
});

//use 'Object.entries' to get each data object value

data.forEach(function(dataObject) {
    console.log(dataObject);
    var row = tbody.append("tr");

    Object.entries(dataObject).forEach(function([key, value]) {
        console.log(key,value);
    });
});

//use d3 to append 1 cell per dataObject value
// (datetime, city, state, country, shape, durationMinutes, comments)

data.forEach(function(dataObject) {
    console.log(dataObject);
    var row = tbody.append("tr");

    Object.entries(dataObject).forEach(function([key, value]) {
        console.log(key, value);
        //append a cell to the row for each value

        var cell = row.append("td");
    });
});

//make a list for the column names
var columns = 
["datetime", "city", "state", "country", "shape", "durationMinutes", "comments"];

//put the table data on the webpage

var buildTable = (inputData) => {
    inputData.forEach(ufoData => {
        var row = tbody.append("tr");
        columns.forEach(column => row.append("td").text(ufoData[column]))
    });
}

buildTable(tableData);

//filter with button

var button = d3.select("#filter-btn");
var inputBox = d3.select("#datetime");

button.on("click", () => {
    d3.event.preventDefault();

    var inputBoxData = inputBox.property("value");

    var filterTable = tableData.filter(tableData => tableData.datetime === inputBoxData);

    tbody.html("");

    let response = {
        filterTable
    }

    if (response.filterTable.length !== 0) {
        buildTable(filterTable)
    }

    else {
        tbody.append("tr").append("td").text("No date found, please input another date");
    }
});
