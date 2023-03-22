// declare the map variable here to give it a global scope
let myMap;

// we might as well declare our baselayer(s) here too
const CartoDB_Positron = L.tileLayer(
	'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', 
	{attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
})
const Thunderforest_MobileAtlas = L.tileLayer('https://{s}.tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?apikey={apikey}',
	{attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	apikey: '97a38752e8f84d7994249f64ce3cddc2',
	maxZoom: 22
});

//add the basemap style(s) to a JS object, to which you could also add other baselayers. This object is loaded as a basemap selector as seen further down
let baseLayers = {
	"CartoDB": CartoDB_Positron,
	"Mobile Atlas": Thunderforest_MobileAtlas
};

//function initialize(){
//    loadMap();
//};

function loadMap(mapid){
	//console.log(mapid)
	
	try {
		myMap.remove()
	} catch(e) {
		console.log(e)
		console.log("no map to delete")
	} finally {
		//put your map loading code in here
		if(mapid == "mapa") {
			//now reassign the map variable by actually making it a useful object, this will load your leaflet map
			myMap = L.map('mapdiv', {
				center: [40.64, -98.00]
				,zoom: 4
				,maxZoom: 18
				,minZoom: 4
				,layers: CartoDB_Positron
			})
			fetchData("https://raw.githubusercontent.com/geog-464/geog-464.github.io/main/Amtrak_Stations.geojson")
		}
		
		else if(mapid == "mapb") {
			myMap = L.map('mapdiv', {
				center: [28.40, -13.67]
				,zoom: 2
				,maxZoom: 18
				,minZoom: 2
				,layers: Thunderforest_MobileAtlas
			})
			fetchData("https://raw.githubusercontent.com/geog-464/geog-464.github.io/main/megacities.geojson")
		}}
	
	//declare basemap selector widget
	let lcontrol = L.control.layers(baseLayers);
	
	//add the widget to the map
	lcontrol.addTo(myMap);

	return mapid
};

function fetchData(url){
    //load the data
    fetch(url)
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //create a Leaflet GeoJSON layer using the fetched json and add it to the map object
            L.geoJson(json, {style: styleAll, pointToLayer: generateCircles, onEachFeature: addPopups}).addTo(myMap);
        })
};

function generateCircles(feature, latlng) {
	return L.circleMarker(latlng);
};

function styleAll(feature, latlng) {
	//console.log(feature.properties.ZipCode)

	var styles = {dashArray:null, dashOffset:null, lineJoin:null, lineCap:null, stroke:false, color:'#000', opacity:1, weight:1, fillColor:null, fillOpacity:0 };

	if (feature.geometry.type == "Point") {
		styles.fillColor = '#fff'
		,styles.fillOpacity = 0.5
		,styles.stroke=true
		,styles.radius=9
	}

	if (typeof feature.properties.ZipCode == "string") {
		styles.fillColor = 'cyan'
	}
	
	return styles;
};

function addPopups(feature, layer) {
	//console.log(feature, layer)
	//console.log(layer._radius)
	//console.log(layer.options.fill)
	//console.log(layer.getLatLng())
	//layer.options.fill = false
	//layer._radius = 80
	if(mapdropdown.value == "mapa") {
		layer.bindPopup("Station Name: " + feature.properties.StationNam);
	}

	else if(mapdropdown.value == "mapb") {
		layer.bindPopup("City: " + feature.properties.city + "<br>" + "Population: " + feature.properties.pop_2018);
	}};

var mapdropdown = document.getElementById("mapdropdown");
//console.log(mapdropdown)
mapdropdown.addEventListener("change", mapChange);

function mapChange() {
	loadMap(mapdropdown.value)
};

//window.onload = initialize();