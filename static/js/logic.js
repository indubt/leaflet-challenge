function getColor(magnitude){
    if(magnitude < 1)
        return "#1a9850"
    else if(magnitude < 2)
        return "#91cf60"
    else if (magnitude < 4)
        return "#d9ef8b"
    else if (magnitude < 6)
        return "#fee08b"
    else if(magnitude < 8)
        return "#fc8d59"
    else 
        return "#d73027"
    
}

// function to create Earthquake Map
function createMap(earthquakeMarkers) {

    // Create the tile layer that will be the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
  
    // Create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
      "Street Map": streetmap
    };
  
    // Create an overlayMaps object to hold the earthquakeMarkers layer.
    let overlayMaps = {
      "Earthquakes": earthquakeMarkers
    };
  
    // Create the map object with options.
    let map = L.map("map", {
      center: [39.60, -118.1142],
      zoom: 8,
      layers: [streetmap, earthquakeMarkers]
    });
  
    // Create a layer control, and pass it  baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);

    // add legend
    let info = L.control({
        position: "bottomright"
    });

    info.onAdd = function(){
        let div = L.DomUtil.create("div", "legend");
        var grades = ['< 01', '01-02', '02-04', '04-06', '06-08', '8+'];
        var colors = [
            '#1a9850',
            '#91cf60',
            '#d9ef8b',
            '#fee08b',
            '#fc8d59',
            '#d73027'
            ];
        var labels = [];
        // loop through our density intervals and generate a label with a colored square for each interval
        grades.forEach(function(grade, index){
            labels.push("<div class = 'row'><li style=\"background-color: " + colors[index]  + "\">"+grade+"</li></div>");
        })
          
        div.innerHTML += "<ul>" + labels.join("") +"</ul>";
    
        return div;
    }
    
    info.addTo(map);
  }



// function to create markers for the earthquake Map
function createMarkers(response){
    console.log("response: ", response.features)

    // pull the features data
    let features = response.features;

    // Initialize array for earthquake markers
    let earthquakeMarkers = [];

    // loop through the features array.
    for(let i=0; i < features.length; i++) {

        let feature = features[i];

        let color = getColor(feature.properties.mag);
        // for each earthquake feature, create a marker, add a bind popup

        let marker = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]],{
            color: color,
            fillColor: color,
            fillOpacity: 0.75,
            radius: 1000*feature.geometry.coordinates[2]
        })
            .bindPopup("place: "+ feature.properties.place+"<br>Magnitude: "+feature.properties.mag+"<br>Depth: "+feature.geometry.coordinates[2]);

        // Add the marker to the earthquakeMarkers array
        earthquakeMarkers.push(marker);

    }

  // Create a layer group that's made from the earthquake markers array, and pass it to the createMap function.
  createMap(L.layerGroup(earthquakeMarkers));

}


// Perform an API call to the Geo Json Summary for past 7 days API to get the earthquake information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
