export const setupRegimeTypes = (map, countries) => {
  map.addSource('countries', {
    type: 'geojson',
    data: countries,
  });
  
  map.addLayer({
    'id': 'country-fills',
    'type': 'fill',
    'source': 'countries',
    'layout': {
      'visibility': 'none',
    },
    'paint': {
      'fill-color': ['get', 'color'],
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.75,
        0.25
      ]
    }
  });

  map.addLayer({
    'id': 'country-borders',
    'type': 'line',
    'source': 'countries',
    'layout': {
      'visibility': 'none',
    },
    'paint': {
      'line-color': '#627BC1',
    }
  });
};


export const setupSpeakerMarkers = (map, markers) => {
  map.addSource('speakers', {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': markers,
      // 'features': [{
      //   'type': 'Feature',
      //   'properties': {
      //     'description':
      //     '<strong>Make it Mount Pleasant</strong><p><a href="http://www.mtpleasantdc.com/makeitmtpleasant" target="_blank" title="Opens in a new window">Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>',
      //     },
      //   'geometry': {
      //     'type': 'Point',
      //     'coordinates': [-77.038659, 38.931567]
      //   }
      // }],
    }
  });
    // Add a layer showing the places.
  map.addLayer({
    'id': 'speakers',
    'type': 'circle',
    'source': 'speakers',
    'layout': {
      // make layer visible by default
      'visibility': 'visible'
    },
    'paint': {
      'circle-radius': 8,
      'circle-color': 'rgba(55,148,179,1)'
    },
  });
}
