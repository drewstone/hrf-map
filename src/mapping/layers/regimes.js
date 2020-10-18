import { getDemocratic, getNonDemocratic } from '../data';

export default (map, countries) => {
  map.addSource('democratic-countries', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: getDemocratic(countries.features),
    },
  });

  map.addSource('non-democratic-countries', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: getNonDemocratic(countries.features),
    },
  });

  map.addLayer({
    'id': 'non-democratic-country-fills',
    'type': 'fill',
    'source': 'non-democratic-countries',
    'layout': {
      'visibility': 'visible',
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
    'id': 'non-democratic-country-borders',
    'type': 'line',
    'source': 'non-democratic-countries',
    'layout': {
      'visibility': 'none',
    },
    'paint': {
      'line-color': '#627BC1',
    }
  });
};
