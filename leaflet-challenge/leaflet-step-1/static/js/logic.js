//store api enpoint url and tectonic plate URL
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&aLL_week";
var tectonicUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
//perform a GET request

d3.json(queryUrl, function(data) {

    createFeatures(data.features);

});

function createFeatures(earthquakeData) {
    //Define a function to run once for eadch feature in the features array
    //give each feature with place and time attributes
    function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + 
    "</h3><hr><p>" + new Date(feature.properties.time) + "</hr></p>" +
    "<hr><p>Magnitude: " + feature.properties.mag + "</p>");
}

//GeoJSON to contain features array then run it for each piece of data in the array

var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
});

createMap(earthquakes);
}

function createMap(earthquakes) {
//define layers

var worldMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
});

var darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
});
//baseMaps holds our layers
var baseMaps = {
    "World Map": worldMap,
    "Dark Map": darkMap
};

//Add tectonic plates function and layer

d3.json(tectonicUrl, function(tectonicData) {
    L.geoJSON(tectonicData, {
        color: "purple",
        weight: 2
    }).addTo(tectonic);
});

var tectonic = new L.LayerGroup();

//create overlay object to hold our overlay layer
var overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic Plates": tectonic
    
};

var myMap = L.map("mapid", {
    center: [0,0],
    zoom: 1.5,
    layers: [worldMap, tectonic]
});

//create layer control, pass in baseMaps + overlayMaps + layer control to map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

    
}