import 'mapbox-gl/dist/mapbox-gl.css';

import mapboxgl from 'mapbox-gl';
import addLayers from './layers';

const setup = (countries,  markers) => {
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v11',
    center: [0.0, 30.0],
    zoom: 2
  });

  let hoveredStateId = null;
  let currentCoords = null;

  map.on('load', function() {
    addLayers(map, countries,  markers);

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

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

    map.on('mousemove', function(e) {
      document.getElementById('info').innerHTML =
      // e.point is the x, y coordinates of the mousemove event relative
      // to the top-left corner of the map
      JSON.stringify(e.point) +
      '<br />' +
      // e.lngLat is the longitude, latitude geographical position of the event
      JSON.stringify(e.lngLat.wrap());
      currentCoords = e.lngLat.wrap();
    });
  });
};

export default setup;
