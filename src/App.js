require('dotenv').config();
import './App.css';

import React from 'react';
import mapboxgl from 'mapbox-gl';
import setup from './mapping';
import { getColor } from './mapping/data';
import polylabel from 'polylabel';
import getdocs from './util/webauth';
import createDescription, { topics } from './util/formatPopup';
const countries = require('./countries.geo.json');
const credentials = require('./credentials.json');
const token = require('./token.json');

class App extends React.Component {
  map;

  componentDidMount() {
    const markers = {
      type: 'FeatureCollection',
      features: [],
    };

    getdocs(credentials, token)
    .then((data) => {
      countries.features = countries.features.map((feature, inx) => {
        const p = polylabel(feature.geometry.coordinates, 0.1);
        if (!isNaN(p[0])) {
          markers.features.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [p[0], p[1]],
            },
            properties: {
              title: 'Mapbox',
              description: feature.properties.formal_en,
              'marker-color': '#3bb2d0',
              'marker-size': 'large',
              'marker-symbol': 'rocket',
            }
          });
        }

        return {
          ...feature,
          id: inx,
          properties: {
            ...feature.properties,
            color: getColor(feature),
            description: createDescription(feature, data),
          }
        }
      });
    
      mapboxgl.accessToken = process.env.MAPBOX_TOKEN;
      setup(countries, markers);
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div id="map"></div>
          <pre id="info"></pre>
        </header>
      </div>
    );
  }

}

export default App;
