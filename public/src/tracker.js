const api = '1.0';
let result;

async function searchSelection() {
  try {
    let url;
    const range = $('#amount').val();
    const type = $('.type-select').val();
    const body = {
      range,
      type,
    };
    if (body.range == !null && body.type == !null) {
      url = `/api/${api}/data/map/date`;
    } else if (body.range) {
      url = `/api/${api}/data/map/date`;
    } else if (body.type) {
      url = `/api/${api}/data/map/type`;
    }

    const options = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const rawDataSelect = await fetch(url, options);
    const dataSelect = await rawDataSelect.json();
    if (dataSelect) {
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
          zoom: 9.5, // Zoom level
          container: 'viewDiv', // Div element
        });

        const graphicsLayer = new GraphicsLayer();
        map.layers.add(graphicsLayer);

        dataSelect['data'].forEach((e) => {
          let color;
          const match = e.name.match(/海豚/i);
          if (match != null) {
            if (match[1] != '') {
              color = '#e9c46a';
            }
          } else {
            color = '#006d77';
          }
          // Create point
          const point = {
            type: 'point',
            longitude: e.longitude,
            latitude: e.latitude,
          };
          const template = {
            title: '鯨豚目擊',
            content:
              `<p>日期：${e.year + '.' + e.month + '.' + e.day}</p>` +
              `<p>鯨豚種類：${e.name}</p>` +
              `<p>經度：${e.longitude} 緯度：${e.latitude}</p>`,
            // `<img src='${e.img}'></img>`,
          };

          const simpleMarkerSymbol = {
            type: 'simple-marker',
            color: color,
            size: 10,
            style: 'circle',
            outline: {
              color: '#fff',
              width: 0.5,
            },
          };

          const pointGraphic = new Graphic({
            popupTemplate: template,
            geometry: webMercatorUtils.geographicToWebMercator(point),
            symbol: simpleMarkerSymbol,
          });
          graphicsLayer.add(pointGraphic);
        });
      });
    } else {
      console.log('No data recieved');
    }
  } catch (err) {
    console.log('Error', err);
  }
}

(async () => {
  try {
    result = await (async function getData() {
      let data;
      const url = `/api/${api}/data/map/all`;
      try {
        const options = {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
          },
        };
        const rawData = await fetch(url, options);
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
      zoom: 9.5, // Zoom level
      container: 'viewDiv', // Div element
    });

    const graphicsLayer = new GraphicsLayer();
    map.layers.add(graphicsLayer);

    result['data'].forEach((e) => {
      let color;
      const match = e.name.match(/海豚/i);
      if (match != null) {
        if (match[1] != '') {
          color = '#e9c46a';
        }
      } else {
        color = '#006d77';
      }
      // Create point
      const point = {
        type: 'point',
        longitude: e.longitude,
        latitude: e.latitude,
      };
      const template = {
        title: '鯨豚目擊',
        content:
          `<p>日期：${e.year + '.' + e.month + '.' + e.day}</p>` +
          `<p>鯨豚種類：${e.name}</p>` +
          `<p>經度：${e.longitude} 緯度：${e.latitude}</p>`,
        // `<img src='${e.img}'></img>`,
      };

      const simpleMarkerSymbol = {
        type: 'simple-marker',
        color: color,
        size: 10,
        style: 'circle',
        outline: {
          color: '#fff',
          width: 0.5,
        },
      };

      const pointGraphic = new Graphic({
        popupTemplate: template,
        geometry: webMercatorUtils.geographicToWebMercator(point),
        symbol: simpleMarkerSymbol,
      });
      graphicsLayer.add(pointGraphic);
    });
  });
})();

$(function () {
  const formatDate = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  $('#slider-range').slider({
    range: true,
    min: new Date('1998, 01, 01').getTime() / 1000,
    max: new Date('2021, 12, 31').getTime() / 1000,
    step: 86400,
    values: [
      new Date('1998, 01, 01').getTime() / 1000,
      new Date('2021, 12, 31').getTime() / 1000,
    ],
    slide: function (event, ui) {
      $('#amount').val(
        formatDate.format(new Date(ui.values[0] * 1000)) +
          ' - ' +
          formatDate.format(new Date(ui.values[1] * 1000))
      );
    },
  });
  $('#amount').val(
    formatDate.format(new Date($('#slider-range').slider('values', 0) * 1000)) +
      ' - ' +
      formatDate.format(new Date($('#slider-range').slider('values', 1) * 1000))
  );
});
