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

    map.on('mousemove', 'country-fills', function(e) {
      if (e.features.length > 0) {
        if (hoveredStateId) {
          map.setFeatureState({ source: 'countries', id: hoveredStateId }, { hover: false });
        }

        hoveredStateId = e.features[0].id;
        map.setFeatureState({ source: 'countries', id: hoveredStateId }, { hover: true });
      }

      map.getCanvas().style.cursor = 'pointer';
    });
  
    // When the mouse leaves the country-fill layer, update the feature state of the
    // previously hovered feature.
    map.on('mouseleave', 'country-fills', function() {
      map.getCanvas().style.cursor = '';
      if (hoveredStateId) {
        map.setFeatureState({ source: 'countries', id: hoveredStateId }, { hover: false });
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
  var toggleableLayerIds = ['countries', 'speakers'];

  // set up the corresponding toggle button for each layer
  for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = '';
    link.textContent = id;
    
    link.onclick = function(e) {
      var clickedLayer = this.textContent;
      e.preventDefault();
      e.stopPropagation();
      const vis = (clickedLayer === 'countries')
        ? map.getLayoutProperty('country-fills', 'visibility')
        : map.getLayoutProperty(clickedLayer, 'visibility');

      // toggle layer visibility by changing the layout object's visibility property
      if (vis === 'visible') {
        if (clickedLayer === 'countries') {
          map.setLayoutProperty('country-fills', 'visibility', 'none');
          map.setLayoutProperty('country-borders', 'visibility', 'none');
        } else {
          map.setLayoutProperty(clickedLayer, 'visibility', 'none');
        }
        this.className = '';
      } else {
        if (clickedLayer === 'countries') {
          map.setLayoutProperty('country-fills', 'visibility', 'visible');
          map.setLayoutProperty('country-borders', 'visibility', 'visible');
        } else {
          map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
        this.className = 'active';
        
      }
    };

    var layers = document.getElementById('menu');
    layers.appendChild(link);
  }
};

export default setup;
