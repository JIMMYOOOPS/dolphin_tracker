let result;

(async () => {
  try {
    result = await (async function getData() {
      let data;
      try {
        const url = {
          all: 'http://localhost:3000/api/1.0/data/all',
          gps: 'http://localhost:3000/api/1.0/data/gps',
        };
        const options = {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
          },
        };

        let rawData = await fetch(url.gps, options);
        data = await rawData.json();
      } catch (err) {
        console.log(err.message);
      }
      return data;
    })();
  } catch (err) {
    consolelog(err.message);
  }

  require([
    'esri/config',
    'esri/Map',
    'esri/views/MapView',
    'esri/Graphic',
    'esri/layers/GraphicsLayer',
    'esri/geometry/support/webMercatorUtils',
    'esri/PopupTemplate',
  ], function (
    esriConfig,
    Map,
    MapView,
    Graphic,
    GraphicsLayer,
    webMercatorUtils,
    PopupTemplate
  ) {
    esriConfig.apiKey =
      'AAPK14e8b1a8eb1f48beaad47d28c4d335221_c7Doo9zFS2Pv17AUrtadlnzRey-jAZlzq9N_1oIp8MD9Bzg_b_mjsW-xVbx2z3';
    const map = new Map({
      basemap: 'topo-vector', // Basemap layer service
    });

    const view = new MapView({
      map: map,
      center: [121.5, 23.75], // Longitude, latitude
      zoom: 10, // Zoom level
      container: 'viewDiv', // Div element
    });

    const graphicsLayer = new GraphicsLayer();
    map.layers.add(graphicsLayer);

    const simpleMarkerSymbol = {
      type: 'simple-marker',
      color: '#102F4A',
      size: 10,
      style: 'circle',
      outline: {
        color: '#fff',
        width: 1,
      },
    };

    result['data'].forEach((e) => {
      // const attribute = {
      //   date: e.year+'.'+e.month+'.'+e.day,
      // }
      // Create point
      const point = {
        type: 'point',
        longitude: e.longitude,
        latitude: e.latitude,
      };

      let pointGraphic = new Graphic({
        popupTemplate: {
          title: e.year + '.' + e.month + '.' + e.day,
          content: e.dolphin_type + ' ' + e.weather,
          // [{
          //   type: 'fields',
          //   fieldInfos: [{
          //     fieldName: 'test123',
          //     format: {
          //       digitSeparator: true
          //     }},
          //     {
          //       fieldName: 'expression/per-asian'
          //   }
          // ]
          // }]
        },
        geometry: webMercatorUtils.geographicToWebMercator(point),
        symbol: simpleMarkerSymbol,
      });
      graphicsLayer.add(pointGraphic);
    });
  });
})();
