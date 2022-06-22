const url = {
  all: `http://localhost:3000/api/1.0/data/all`,
  gps: `http://localhost:3000/api/1.0/data/gps`
}
const options = {
    method: 'GET',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
    }
};

(async () => {
  try {
  let rawData = await fetch(url.gps, options);
  let data = await rawData.json();
  console.log(data)
} catch(err) {
  console.log(err.message)
};
})()

require([     
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/Graphic",
    "esri/layers/GraphicsLayer"
    ], function(
    esriConfig, 
    Map, 
    MapView, 
    SimpleMarkerSymbol,
    SimpleRenderer,
    Graphic,
    GraphicsLayer
    ) {
    esriConfig.apiKey= 'AAPK14e8b1a8eb1f48beaad47d28c4d335221_c7Doo9zFS2Pv17AUrtadlnzRey-jAZlzq9N_1oIp8MD9Bzg_b_mjsW-xVbx2z3';
    const map = new Map({
        basemap: "topo-vector" // Basemap layer service
      });

    const view = new MapView({
        map: map,
        center: [121.5, 23], // Longitude, latitude
        zoom: 8, // Zoom level
        container: "viewDiv" // Div element
      });

    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    const point = 
    { 
      type: 'point',
      longitude: 121,
      latitude: 23
    };

    const simpleMarkerSymbol = {
        type: "simple-marker",
        color: [226, 119, 40],  // Orange
        outline: {
            color: [255, 255, 255], // White
            width: 0.5
          }
    };

    const pointGraphic = new Graphic({
      geometry: point,
      symbol: simpleMarkerSymbol
    });
    graphicsLayer.add(pointGraphic);
});
