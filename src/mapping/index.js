/* eslint-disable no-loop-func */
import 'mapbox-gl/dist/mapbox-gl.css';

import mapboxgl from 'mapbox-gl';
import { setupRegimeTypes, setupSpeakerMarkers } from './layers';

const setup = (countries,  markers) => {
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/drewstone/ckezzfdui0vq419t55kxnpvvj',
    center: [0.0, 30.0],
    zoom: 2
  });

  let hoveredStateId = null;
  let currentCoords = null;

  map.on('load', function() {
    setupRegimeTypes(map, countries)
    setupSpeakerMarkers(map, markers)

    map.on('mousemove', function(e) { currentCoords = e.lngLat.wrap(); });

    map.on('mousemove', 'non-democratic-country-fills', function(e) {
      if (e.features.length > 0) {
        if (hoveredStateId) {
          map.setFeatureState({ source: 'non-democratic-countries', id: hoveredStateId }, { hover: false });
        }

        hoveredStateId = e.features[0].id;
        map.setFeatureState({ source: 'non-democratic-countries', id: hoveredStateId }, { hover: true });
      }

      map.getCanvas().style.cursor = 'pointer';
    });
  
    // When the mouse leaves the country-fill layer, update the feature state of the
    // previously hovered feature.
    map.on('mouseleave', 'non-democratic-country-fills', function() {
      map.getCanvas().style.cursor = '';
      if (hoveredStateId) {
        map.setFeatureState({ source: 'non-democratic-countries', id: hoveredStateId }, { hover: false });
      }
      hoveredStateId = null;
    }); 
    
    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'country-fills', function(e) {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.description;
      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup({
        offset: [0, -15],
        className: 'popups',
      })
      .setLngLat(currentCoords)
      .setHTML(description)
      .setMaxWidth()
      .addTo(map);
    });
  });

  // enumerate ids of the layers
  var toggleableLayerIds = ['non-democratic-country-fills', 'non-democratic-country-borders', 'speakers'];
  const toggleDispalyNames = {
    'non-democratic-country-fills': 'regimes',
    'non-democratic-country-borders': 'borders',
    'speakers': 'speakers',
  }

  // set up the corresponding toggle button for each layer
  for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = (id === 'non-democratic-country-fills') ? 'active' : '';
    link.textContent = id;

    link.onclick = function(e) {
      var clickedLayer = this.textContent;
      e.preventDefault();
      e.stopPropagation();
      const vis = map.getLayoutProperty(clickedLayer, 'visibility');

      // toggle layer visibility by changing the layout object's visibility property
      if (vis === 'visible') {
        map.setLayoutProperty(clickedLayer, 'visibility', 'none');
        this.className = '';
      } else {
        map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        this.className = 'active';
      }
    };

    var layers = document.getElementById('menu');
    layers.appendChild(link);
  }

  var layers = ['0-10', '10-20', '20-50', '50-100', '100-200', '200-500', '500-1000', '1000+'];
  var colors = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];
  var legend = document.getElementById('legend');
  for (i = 0; i < layers.length; i++) {
    var layer = layers[i];
    var color = colors[i];
    var item = document.createElement('div');
    var key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;
  
    var value = document.createElement('span');
    value.innerHTML = layer;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
  }

  return map;
};

export default setup;
