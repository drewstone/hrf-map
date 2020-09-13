/* eslint-disable no-loop-func */
import './App.css';
import React from 'react';
import mapboxgl from 'mapbox-gl';
import setup from './mapping';
import { getColor } from './mapping/data';
import polylabel from 'polylabel';
import getdocs from './util/webauth';
import createDescription from './util/formatPopup';
const countries = require('./countries.geo.json');

const credentials = {
  "installed": {
    "client_id": process.env.REACT_APP_CLIENT_ID,
    "project_id": process.env.REACT_APP_PROJECT_ID,
    "auth_uri": process.env.REACT_APP_AUTH_URI,
    "token_uri": process.env.REACT_APP_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.REACT_APP_AUTH_PROVIDER_X509_CERT_URL,
    "client_secret": process.env.REACT_APP_CLIENT_SECRET,
    "redirect_uris": process.env.REACT_APP_REDIRECT_URIS.split(','),
  }
}

const token = {
  "access_token": process.env.REACT_APP_ACCESS_TOKEN,
  "refresh_token":  process.env.REACT_APP_REFRESH_TOKEN,
  "scope": process.env.REACT_APP_SCOPE,
  "token_type": process.env.REACT_APP_TOKEN_TYPE,
  "expiry_date": Number(process.env.REACT_APP_EXPIRY_DATE),
};

const isIncident = (speaker, feature) => {
  if (speaker.topicCountry === feature.properties.formal_en
    || speaker.topicCountry === feature.properties.admin
    || speaker.topicCountry === feature.properties.name
    || speaker.speakerTitle.includes(feature.properties.formal_en)
    || speaker.speakerTitle.includes(feature.properties.admin)
    || speaker.speakerTitle.includes(feature.properties.name)) {
      return true;
  }
};

class App extends React.Component {
  map;

  componentDidMount() {
    const speakers = {
      type: 'FeatureCollection',
      features: [],
    };

    getdocs(credentials, token)
    .then((data) => {
      console.log(data);
      countries.features = countries.features.map((feature, inx) => {
        const p = polylabel(feature.geometry.coordinates, 0.1);
        if (!isNaN(p[0])) {
          data['Speakers'].forEach(speaker => {
            if (isIncident(speaker, feature)) {
                speakers.features.push({
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [p[0], p[1]],
                  },
                  properties: {
                    title: speaker.speakerTitle,
                    name: speaker.name,
                    country: feature.properties.name,
                    description: speaker.description,
                    region: speaker.topicRegion,
                    twitter: speaker.twitter,
                  }
                });
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
    
      mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
      setup(countries, speakers);
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <nav id="menu"></nav>
          <div id="map"></div>
        </header>
      </div>
    );
  }

}

export default App;
